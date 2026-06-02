import { getPrisma } from "./db";

const openActionStatuses = ["new", "open", "in progress", "waiting on user", "waiting on provider", "waiting on payer"];

export function isAdminUser(userId, email) {
  const adminUserIds = String(process.env.ADMIN_USER_IDS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const adminEmails = String(process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return adminUserIds.includes(userId) || adminEmails.includes(String(email || "").toLowerCase());
}

function participantCode(record = {}) {
  if (record.participantCode) {
    return record.participantCode;
  }

  if (record.clerkUserId) {
    return `VP-${record.clerkUserId.slice(-6).toUpperCase()}`;
  }

  return "VP-UNKNOWN";
}

function sumMetrics(metrics, category) {
  return metrics
    .filter((metric) => metric.category === category)
    .reduce((total, metric) => total + Number(metric.estimatedDollarValue ?? metric.numericValue ?? 0), 0);
}

function formatDollars(value) {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`;
  }

  return `$${Number(value || 0).toLocaleString()}`;
}

function formatPercent(numerator, denominator) {
  if (!denominator) {
    return "0%";
  }

  return `${Math.round((numerator / denominator) * 100)}%`;
}

function lowConfidenceScore(record = {}) {
  return Math.min(
    Number(record.confidenceScore ?? 1),
    Number(record.evidenceScore ?? 1),
  );
}

function mapQaItem(record, source) {
  return {
    id: record.id,
    user: participantCode(record),
    source,
    output: record.plainEnglishSummary || record.overallPicture || record.summary || "Summary generated.",
    confidence: Math.round(Number(record.confidenceScore || 0) * 100),
    evidence: Math.round(Number(record.evidenceScore || 0) * 100),
    status: lowConfidenceScore(record) < 0.65 ? "Needs QA" : "Ready",
  };
}

export async function getAdminDashboardData() {
  if (!process.env.DATABASE_URL) {
    return getPrototypeAdminDashboardData();
  }

  const prisma = getPrisma();
  const [
    users,
    consents,
    actions,
    actionHistory,
    impactMetrics,
    advocacyRequests,
    caregiverUpdates,
    caregiverTasks,
    secureLinks,
    visits,
    labReviews,
    imagingReviews,
  ] = await Promise.all([
    prisma.intakeProfile.findMany({ orderBy: { completedAt: "desc" } }),
    prisma.consentRecord.findMany({ orderBy: { acceptedAt: "desc" } }),
    prisma.careAction.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.careActionHistory.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.impactMetric.findMany({ orderBy: { generatedAt: "desc" }, take: 200 }),
    prisma.advocacyRequest.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.caregiverUpdate.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.caregiverTask.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.secureShareLink.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.visitCopilotSession.findMany({ orderBy: { startedAt: "desc" }, take: 100 }),
    prisma.labInterpretation.findMany({ orderBy: { generatedAt: "desc" }, take: 100 }),
    prisma.imagingInterpretation.findMany({ orderBy: { generatedAt: "desc" }, take: 100 }),
  ]);

  const userMap = new Map(users.map((user) => [user.clerkUserId, user]));
  const openActions = actions.filter((action) => openActionStatuses.includes(String(action.status || "").toLowerCase()));
  const completedActions = actions.filter((action) => ["completed", "resolved", "sent"].includes(String(action.status || "").toLowerCase()));
  const caregiverSentCount = caregiverUpdates.filter((update) => update.sentAt || String(update.status || "").toLowerCase() === "sent").length;
  const documentReviewCount = labReviews.length + imagingReviews.length;
  const lowQaItems = [
    ...visits.map((visit) => mapQaItem({
      ...visit,
      plainEnglishSummary: visit.plainEnglishSummary,
      clerkUserId: visit.clerkUserId,
    }, "Visit Copilot")),
    ...labReviews.map((review) => mapQaItem(review, "Uploaded lab")),
    ...imagingReviews.map((review) => mapQaItem(review, "Uploaded imaging")),
  ].filter((item) => item.status === "Needs QA").slice(0, 8);

  const issueQueue = [
    ...lowQaItems.map((item) => ({
      priority: item.confidence < 60 ? "High" : "Medium",
      user: item.user,
      title: "Low-confidence generated summary",
      detail: `${item.source} output needs review before relying on it for pilot reporting.`,
      category: "Clinical QA",
    })),
    ...secureLinks
      .filter((link) => link.expiresAt < new Date() && !link.viewedAt)
      .slice(0, 4)
      .map((link) => ({
        priority: "Low",
        user: participantCode(link),
        title: "Secure link expired before view",
        detail: `${link.title} expired before the caregiver viewed it.`,
        category: "Caregiver",
      })),
    ...advocacyRequests
      .filter((request) => ["open", "new"].includes(String(request.status || "").toLowerCase()))
      .slice(0, 4)
      .map((request) => ({
        priority: request.priority === "urgent" ? "High" : "Medium",
        user: participantCode(request),
        title: "Open advocacy request",
        detail: request.title,
        category: "Advocacy",
      })),
  ].slice(0, 8);

  return {
    generatedAt: new Date().toISOString(),
    kpis: {
      pilotSeats: 100,
      accountsCreated: users.length,
      onboardingCompleted: users.length,
      consentsCompleted: new Set(consents.map((consent) => consent.clerkUserId)).size,
      visitsRecorded: visits.length,
      uploadedDocumentsReviewed: documentReviewCount,
      avoidableDelaysFlagged: sumMetrics(impactMetrics, "avoidable_delay"),
      costExposureClarified: formatDollars(sumMetrics(impactMetrics, "cost_exposure")),
      caregiverUpdatesSent: caregiverSentCount,
      actionProgressRate: formatPercent(completedActions.length, actions.length),
    },
    successMetrics: [
      { label: "Open actions completed or moved forward", value: formatPercent(completedActions.length + actionHistory.length, actions.length + actionHistory.length), percent: Math.min(100, Math.round(((completedActions.length + actionHistory.length) / Math.max(actions.length + actionHistory.length, 1)) * 100)) },
      { label: "Visit summaries created", value: String(visits.length), percent: Math.min(100, visits.length * 10) },
      { label: "Uploaded documents converted into review outputs", value: String(documentReviewCount), percent: Math.min(100, documentReviewCount * 10) },
      { label: "Caregiver updates sent", value: String(caregiverSentCount), percent: Math.min(100, caregiverSentCount * 10) },
    ],
    issueQueue,
    qaItems: lowQaItems.length ? lowQaItems : [
      ...visits.slice(0, 4).map((visit) => mapQaItem(visit, "Visit Copilot")),
      ...labReviews.slice(0, 4).map((review) => mapQaItem(review, "Uploaded lab")),
      ...imagingReviews.slice(0, 4).map((review) => mapQaItem(review, "Uploaded imaging")),
    ].slice(0, 8),
    operationalStats: {
      actionsCreated: actions.length,
      documentsPrepared: actionHistory.length,
      documentsApprovedOrSent: actionHistory.filter((history) => ["sent", "saved", "completed"].includes(String(history.status || "").toLowerCase())).length,
      successfulSaves: actionHistory.length + caregiverUpdates.length + caregiverTasks.length,
      failedApiCalls: 0,
      secureLinksExpiredBeforeView: secureLinks.filter((link) => link.expiresAt < new Date() && !link.viewedAt).length,
    },
    users: users.slice(0, 20).map((user) => ({
      code: participantCode(user),
      ageYears: user.ageYears,
      sex: user.sex,
      coverageType: user.coverageType,
      onboardingCompletedAt: user.completedAt,
      openActions: openActions.filter((action) => action.clerkUserId === user.clerkUserId).length,
      visits: visits.filter((visit) => visit.clerkUserId === user.clerkUserId).length,
    })),
    recentEvents: [
      ...actionHistory.slice(0, 10).map((history) => ({
        time: history.createdAt,
        user: participantCode(history),
        event: history.eventType,
        outcome: history.summary,
      })),
      ...visits.slice(0, 10).map((visit) => ({
        time: visit.endedAt || visit.startedAt,
        user: participantCode(visit),
        event: "visit_copilot_session",
        outcome: "Visit transcript processed; summary/actions saved.",
      })),
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10),
  };
}

export function getPrototypeAdminDashboardData() {
  return {
    generatedAt: new Date().toISOString(),
    kpis: {
      pilotSeats: 100,
      accountsCreated: 37,
      onboardingCompleted: 24,
      consentsCompleted: 24,
      visitsRecorded: 18,
      uploadedDocumentsReviewed: 29,
      avoidableDelaysFlagged: 42,
      costExposureClarified: "$18.6k",
      caregiverUpdatesSent: 31,
      actionProgressRate: "87%",
    },
    successMetrics: [
      { label: "Open actions completed or moved forward", value: "87%", percent: 87 },
      { label: "Visit summaries created", value: "18", percent: 76 },
      { label: "Uploaded documents converted into review outputs", value: "29", percent: 68 },
      { label: "Caregiver updates sent", value: "31", percent: 92 },
    ],
    issueQueue: [
      { priority: "High", user: "VP-9A31F2", title: "Secure link creation failed", detail: "Could not approve caregiver summary.", category: "Caregiver" },
      { priority: "Medium", user: "VP-77C214", title: "Low-confidence generated summary", detail: "Uploaded lab review is below QA threshold.", category: "Document QA" },
      { priority: "Low", user: "VP-A9081B", title: "Draft advocacy request", detail: "User saved draft but did not submit.", category: "Advocacy" },
    ],
    qaItems: [
      { user: "VP-77C214", source: "Uploaded lab", output: "Possible iron deficiency anemia. Ask about cause, treatment, and repeat labs.", confidence: 72, evidence: 68, status: "Needs QA" },
      { user: "VP-43BB91", source: "Visit Copilot", output: "Provider recommended repeat blood work and a follow-up visit in two weeks.", confidence: 84, evidence: 80, status: "Ready" },
      { user: "VP-C8190D", source: "Uploaded imaging", output: "Report appears stable but mentions follow-up if symptoms change.", confidence: 61, evidence: 57, status: "Needs QA" },
    ],
    operationalStats: {
      actionsCreated: 118,
      documentsPrepared: 64,
      documentsApprovedOrSent: 51,
      successfulSaves: 99,
      failedApiCalls: 4,
      secureLinksExpiredBeforeView: 2,
    },
    users: [
      { code: "VP-77C214", ageYears: 34, sex: "female", coverageType: "Commercial", openActions: 4, visits: 1 },
      { code: "VP-43BB91", ageYears: 52, sex: "male", coverageType: "Commercial", openActions: 2, visits: 1 },
      { code: "VP-C8190D", ageYears: 67, sex: "female", coverageType: "Medicare", openActions: 3, visits: 0 },
    ],
    recentEvents: [
      { time: new Date().toISOString(), user: "VP-77C214", event: "lab_document_reviewed", outcome: "Summary, action, confidence/evidence/rationale saved. Raw file not retained." },
      { time: new Date().toISOString(), user: "VP-43BB91", event: "caregiver_update_approved", outcome: "Secure link created, sent date stored, caregiver metric incremented." },
      { time: new Date().toISOString(), user: "VP-A9081B", event: "advocacy_request_completed", outcome: "Voithos response saved, status set to complete, hidden tags retained." },
    ],
  };
}
