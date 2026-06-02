export const openActionTypes = [
  { type: "appointment", example: "Schedule visit" },
  { type: "insurance", example: "Follow up on prior authorization or other insurance-related issue" },
  { type: "claim", example: "Appeal denied claim" },
  { type: "medication refill", example: "Refill prescription" },
  { type: "records", example: "Send records to specialist" },
  { type: "lab/imaging", example: "Complete bloodwork" },
  { type: "care team message", example: "Message provider" },
  { type: "cost", example: "Find lower-cost option" },
  { type: "caregiver", example: "Assign caregiver task" },
];

export const openActionStatuses = ["new", "in progress", "waiting on user", "waiting on provider", "waiting on payer"];
export const closedActionStatuses = ["completed", "cancelled", "resolved", "duplicate"];

export const demoDetectedActions = [
  {
    title: "Book both specialist visits and ask what to do first",
    detail: "Schedule Dr. Miranda Bailey at Grey-Sloan Hematology and Dr. Meredith Grey at GI Associates of Seattle, and ask Dr. Hammond which visit should happen first.",
    level: "urgent",
    actionType: "appointment",
    owner: "patient",
    status: "new",
    dueDate: "2026-05-13",
    visitDate: "2026-05-18",
    visitLabel: "Visit with Dr. Elisha Hammond",
    foundFrom: "Voithos360 found this by comparing Dr. Hammond's referral plan with upcoming scheduled visits.",
    confidenceScore: 0.78,
    evidenceScore: 0.73,
    rationale: "Referral plan mentions two unresolved specialist visits and no matching scheduled appointments were found.",
  },
  {
    title: "Get repeat blood work at an in-network lab",
    detail: "Confirm when to repeat CBC, ferritin, and iron studies after the iron deficiency anemia plan is set.",
    level: "soon",
    actionType: "lab/imaging",
    owner: "care team",
    status: "waiting on user",
    dueDate: "2026-05-15",
    visitDate: "2026-05-18",
    visitLabel: "Visit with Dr. Elisha Hammond",
    foundFrom: "Voithos360 found this from Jen's low hemoglobin, low hematocrit, low iron saturation, and ferritin of 4.",
    confidenceScore: 0.9,
    evidenceScore: 0.88,
    rationale: "Hemoglobin 10.2, hematocrit 33.0, low MCH/MCHC, iron saturation 12%, and ferritin 4 support iron deficiency anemia follow-up.",
  },
  {
    title: "Share the visit plan with your caregiver",
    detail: "A plain-English update can be reviewed before it is sent.",
    level: "normal",
    actionType: "caregiver",
    owner: "patient",
    status: "new",
    dueDate: "2026-05-16",
    visitDate: "2026-05-18",
    visitLabel: "Visit with Dr. Elisha Hammond",
    foundFrom: "Voithos360 found this from the visit plan and caregiver permissions.",
    confidenceScore: 0.7,
    evidenceScore: 0.66,
    rationale: "Caregiver is listed and the care plan contains several next steps that should be shared after patient approval.",
  },
  {
    title: "Check whether prior authorization may be needed",
    detail:
      "Before scheduling with Dr. Bailey or Dr. Grey, Voithos360 can help confirm whether Aetna PPO approval may be needed.",
    level: "soon",
    actionType: "insurance",
    owner: "insurance plan",
    status: "new",
    dueDate: "2026-05-17",
    visitDate: "2026-05-12",
    visitLabel: "Older unresolved items",
    foundFrom: "Voithos360 found this from the planned specialist visits and Aetna PPO workflow rules.",
    confidenceScore: 0.74,
    evidenceScore: 0.7,
    rationale: "Updated AI action rules flag likely prior authorization when a planned procedure or medication may require payer review.",
  },
  {
    title: "Check specialist coverage and deductible before booking",
    detail:
      "Confirm whether Dr. Miranda Bailey and Dr. Meredith Grey are in network for Aetna PPO, whether the visits are covered, and what the estimated out-of-pocket cost may be.",
    level: "soon",
    actionType: "cost",
    owner: "insurance plan",
    status: "new",
    dueDate: "2026-05-17",
    visitDate: "2026-05-12",
    visitLabel: "Older unresolved items",
    foundFrom: "Voithos360 found this from Dr. Hammond's specialist follow-up plan and Aetna PPO benefit-risk rules.",
    confidenceScore: 0.76,
    evidenceScore: 0.72,
    rationale: "Specialist referrals can create cost exposure when network status, deductible met, and payer rules are unclear.",
  },
  {
    title: "Review your pre-visit prep document",
    detail:
      "Voithos360 prepared questions for your next visit and a plain-English summary of what the appointment is likely about.",
    level: "normal",
    actionType: "visit prep",
    owner: "patient",
    status: "new",
    dueDate: "2026-05-18",
    visitDate: "2026-05-12",
    visitLabel: "Older unresolved items",
    foundFrom: "Voithos360 found this from the upcoming visit and your recent care history.",
    confidenceScore: 0.76,
    evidenceScore: 0.71,
    rationale: "Updated action rules generate visit prep documents before appointments and store them in settings.",
  },
  {
    title: "Review your post-visit summary",
    detail:
      "Voithos360 summarized what changed after the visit, what needs follow-up, and what can be shared with your caregiver.",
    level: "normal",
    actionType: "post visit summary",
    owner: "patient",
    status: "new",
    dueDate: "2026-05-18",
    visitDate: "2026-05-18",
    visitLabel: "Visit with Dr. Elisha Hammond",
    foundFrom: "Voithos360 found this from the visit note, orders, referrals, and visit conversation workflow rules.",
    confidenceScore: 0.77,
    evidenceScore: 0.72,
    rationale: "Updated action rules generate post-visit summaries from notes, orders, referrals, and transcripts.",
  },
];

export const demoHealthGaps = [
  "Referral status needs confirmation.",
  "Iron deficiency anemia follow-up needs a clear treatment and repeat-lab plan.",
  "Insurance coverage should be checked before scheduling.",
];

export const demoImpactMetrics = [
  {
    category: "avoidable_delay",
    label: "Avoidable delays flagged",
    displayValue: "3",
    numericValue: 3,
    calculation:
      "Counts prior authorization not initiated, missing payer/provider response, and specialist scheduling backlog signals.",
    sourceInputs: {
      includedSignals: ["prior auth not initiated", "missing payer/provider response", "open specialist scheduling task with due date"],
    },
  },
  {
    category: "cost_exposure",
    label: "Estimated cost exposure clarified",
    displayValue: "$2.4k",
    numericValue: 2450,
    estimatedDollarValue: 2450,
    unit: "estimated dollars",
    calculation:
      "Estimated from potential out-of-network specialist cost, deductible exposure, duplicate repeat labs, and delayed follow-up risk.",
    sourceInputs: {
      includedSignals: ["Aetna PPO network status unclear", "deductible status unclear", "possible duplicate repeat labs", "delayed follow-up risk"],
      mockEstimateBreakdown: {
        outOfNetworkSpecialistExposure: 1200,
        deductibleExposure: 750,
        duplicateLabRisk: 250,
        delayedFollowUpRisk: 250,
      },
    },
  },
  {
    category: "caregiver_update",
    label: "Caregiver updates sent",
    displayValue: "0",
    numericValue: 0,
    calculation: "Counts caregiver updates approved and sent by the user.",
    sourceInputs: {
      includedSignals: ["approved caregiver update documents"],
    },
  },
];

function normalizeSex(sex = "") {
  return String(sex || "").toLowerCase();
}

function makeMvpAction({ title, detail, level = "normal", source = "age and sex onboarding answers", sortOrder = 0 }) {
  return {
    title,
    detail,
    level,
    actionType: "pre-visit reminder",
    owner: "patient",
    status: "new",
    source: "mvp_previsit_screening",
    sortOrder,
    foundFrom: `Voithos360 found this from ${source}.`,
    confidenceScore: 0.62,
    evidenceScore: 0.58,
    rationale: "MVP preventive reminder generated from age and sex only. It should be confirmed with the provider because full clinical records are not connected yet.",
    metadata: {
      visitLabel: "Before first visit",
      hiddenTags: {
        actionType: "pre-visit reminder",
        source: "age_sex_only",
        visibility: "patient_facing_plain_english",
      },
    },
  };
}

export function buildMvpPreventiveActions(profile = {}) {
  const age = Number(profile.ageYears || 0);
  const sex = normalizeSex(profile.sex);
  const actions = [
    makeMvpAction({
      title: "Ask what routine care you may be due for",
      detail: "At your first visit, ask which routine screenings, vaccines, and blood pressure checks make sense for your age and health history.",
      level: "normal",
      sortOrder: 1,
    }),
  ];

  if (sex === "female" && age >= 21 && age <= 65) {
    actions.push(makeMvpAction({
      title: "Ask if you are due for cervical cancer screening",
      detail: "Ask your provider whether your Pap test or HPV screening is up to date, or when it should be repeated.",
      level: "normal",
      sortOrder: 2,
    }));
  }

  if (sex === "female" && age >= 40) {
    actions.push(makeMvpAction({
      title: "Ask if breast cancer screening is due",
      detail: "Ask whether you are due for a mammogram or whether your provider recommends a different schedule based on your history.",
      level: "normal",
      sortOrder: 3,
    }));
  }

  if (age >= 45) {
    actions.push(makeMvpAction({
      title: "Ask if colon cancer screening is due",
      detail: "Ask which colon cancer screening option is right for you and when it should be completed.",
      level: "normal",
      sortOrder: 4,
    }));
  }

  if (sex === "female" && age >= 65) {
    actions.push(makeMvpAction({
      title: "Ask if bone health screening is due",
      detail: "Ask whether you need a bone density test or other bone health follow-up.",
      level: "normal",
      sortOrder: 5,
    }));
  }

  if (sex === "male" && age >= 50) {
    actions.push(makeMvpAction({
      title: "Ask whether prostate screening should be discussed",
      detail: "Ask your provider whether prostate cancer screening makes sense for you based on your age, history, and preferences.",
      level: "normal",
      sortOrder: 6,
    }));
  }

  return actions;
}

export function buildMvpPreventiveHealthGaps(profile = {}) {
  return buildMvpPreventiveActions(profile).map((action) => action.title);
}

export function buildActionHelpSummary(action = {}) {
  const actionType = String(action.actionType || "").toLowerCase();

  const summaries = {
    appointment: {
      title: "Voithos360 prepared the scheduling step.",
      steps: [
        "Identified Dr. Miranda Bailey at Grey-Sloan Hematology and Dr. Meredith Grey at GI Associates of Seattle.",
        "Prepared the call or portal message with Dr. Hammond's reason for the visits.",
        "Pulled the questions to ask before choosing the appointment date.",
      ],
      next: "Ready for you to approve the scheduling message or place the call.",
      requiresApproval: true,
      approvalLabel: "Approve scheduling message",
      recipient: "provider office",
      preparedDocument:
        "Hello, Dr. Elisha Hammond recommended specialist follow-up for Jen Morgan. Please help schedule Dr. Miranda Bailey at Grey-Sloan Hematology for anemia and Dr. Meredith Grey at GI Associates of Seattle for elevated liver enzymes. Please confirm which visit should happen first, whether records or lab results are needed before the appointment, and the earliest available appointment options.",
    },
    insurance: {
      title: "Voithos360 prepared the insurance follow-up.",
      steps: [
        "Identified the Aetna PPO coverage and approval question.",
        "Prepared a plain-English benefits message.",
        "Listed what to ask about coverage, authorization, and patient cost.",
      ],
      next: "Ready for you to approve the insurance message.",
      requiresApproval: true,
      approvalLabel: "Approve insurance message",
      recipient: "insurance plan",
      preparedDocument:
        "Hello, I need help confirming Aetna PPO coverage and any authorization requirements before scheduling specialist care. Please confirm whether visits with Dr. Miranda Bailey at Grey-Sloan Hematology and Dr. Meredith Grey at GI Associates of Seattle are covered, whether prior authorization is required, and what my estimated out-of-pocket cost may be. If medical necessity documentation is required, please send the questionnaire so it can be completed with supporting clinical information.",
    },
    claim: {
      title: "Voithos360 prepared the claim appeal step.",
      steps: [
        "Flagged the denial or claim issue.",
        "Drafted the appeal question in plain English.",
        "Listed the documents that may be needed to support the appeal.",
      ],
      next: "Ready for you to review before sending or escalating.",
      requiresApproval: true,
      approvalLabel: "Approve appeal draft",
      recipient: "insurance plan",
      preparedDocument:
        "Hello, I am requesting a review of this denied claim. Please explain the reason for denial in plain language and identify what documents or corrections are needed to appeal or resubmit it.",
    },
    "medication refill": {
      title: "Voithos360 prepared the refill request.",
      steps: [
        "Checked for likely refill blockers.",
        "Prepared a provider message asking what is needed.",
        "Added safety checks or lab requirements when relevant.",
      ],
      next: "Ready for you to approve the refill message.",
      requiresApproval: true,
      approvalLabel: "Approve refill message",
      recipient: "provider office",
      preparedDocument:
        "Hello, I need help with a medication refill. Please confirm whether the prescription can be renewed now or whether labs, a visit, or any safety check is needed first.",
    },
    records: {
      title: "Voithos360 prepared the records request.",
      steps: [
        "Identified which record or report is needed.",
        "Prepared the request for the sending office.",
        "Added the receiving provider or specialist as the destination.",
      ],
      next: "Ready for you to approve the records request.",
      requiresApproval: true,
      approvalLabel: "Approve records request",
      recipient: "medical records office",
      preparedDocument:
        "Hello, please send the requested records to the specialist office listed in my care plan. Please confirm which records were sent and when the receiving office should expect them.",
    },
    "lab/imaging": {
      title: "Voithos360 clarified the lab next step.",
      steps: [
        "Identified the low hemoglobin, low hematocrit, low iron saturation, and very low ferritin.",
        "Grouped the CBC, iron studies, ferritin, and reticulocyte count into one plain-English picture.",
        "Listed what to ask about iron treatment, repeat labs, and what may be causing the low iron.",
      ],
      next: "No message is needed here. Ask the provider which repeat labs are needed, when to do them, and where to go.",
      recipient: "patient",
    },
    "care team message": {
      title: "Voithos360 drafted the provider message.",
      steps: [
        "Turned the issue into a short plain-English message.",
        "Included the key question and requested next step.",
        "Marked who should respond.",
      ],
      next: "Ready for you to review and send.",
      requiresApproval: true,
      approvalLabel: "Approve provider message",
      recipient: "care team",
      preparedDocument:
        "Hello, I have a care question and need help understanding the next step. Please review the issue, tell me what needs to happen next, and let me know if an appointment, order, or medication change is needed.",
    },
    "visit prep": {
      title: "Voithos360 prepared your visit prep document.",
      steps: [
        "Summarized why the appointment matters.",
        "Prepared questions specific to the visit.",
        "Saved the document in settings so you can find it later.",
      ],
      next: "Ready for you to approve and save before the visit.",
      requiresApproval: true,
      approvalLabel: "Approve visit prep document",
      recipient: "documents",
      preparedDocument:
        "Visit prep summary for Dr. Elisha Hammond: Bring up Jen's fatigue, weakness, iron deficiency anemia pattern, including hemoglobin 10.2, hematocrit 33.0, iron saturation 12%, and ferritin 4, plus elevated liver enzymes. Ask what may be causing the low iron, what treatment should start, when CBC/ferritin/iron studies and liver labs should be repeated, whether Mounjaro, metformin, or Xanax should change, and whether Aetna PPO approval is needed for Dr. Bailey or Dr. Grey.",
    },
    "post visit summary": {
      title: "Voithos360 prepared your post-visit summary.",
      steps: [
        "Summarized the visit in plain English.",
        "Pulled unresolved next steps into the action list.",
        "Prepared a caregiver-friendly version if you want to share it.",
      ],
      next: "Ready to save and share with your caregiver if you choose.",
      requiresApproval: true,
      approvalLabel: "Approve caregiver summary",
      recipient: "caregiver",
      preparedDocument:
        "Post-visit summary: Jen saw Dr. Elisha Hammond for fatigue, weakness, iron deficiency anemia labs, and elevated liver enzymes. Dr. Hammond discussed low hemoglobin, very low ferritin, current medicines, and repeat CBC/ferritin/iron studies/liver labs in about 6 to 8 weeks. Next steps are scheduling Dr. Miranda Bailey at Grey-Sloan Hematology and Dr. Meredith Grey at GI Associates of Seattle, checking Aetna PPO coverage, and sharing Alicia Morgan's caregiver update if Jen approves.",
    },
    cost: {
      title: "Voithos360 prepared the cost check.",
      steps: [
        "Identified the lower-cost question.",
        "Prepared the benefits or provider cost message.",
        "Flagged in-network and out-of-network questions.",
      ],
      next: "Ready for you to approve the cost check.",
      requiresApproval: true,
      approvalLabel: "Approve cost check",
      recipient: "insurance plan or provider billing office",
      preparedDocument:
        "Hello, I need help understanding Aetna PPO coverage and patient cost before scheduling specialist care. Please confirm whether Dr. Miranda Bailey at Grey-Sloan Hematology and Dr. Meredith Grey at GI Associates of Seattle are in network, whether hematology and GI visits are covered, whether my deductible has been met, and the estimated in-network versus out-of-network out-of-pocket cost.",
    },
    caregiver: {
      title: "Voithos360 drafted the caregiver update.",
      steps: [
        "Summarized what changed in plain English.",
        "Listed what needs to be scheduled or watched.",
        "Prepared the update for the caregiver you named.",
      ],
      next: "Ready for you to approve before sharing.",
      requiresApproval: true,
      approvalLabel: "Approve caregiver update",
      recipient: "caregiver",
      preparedDocument:
        "Alicia, Jen saw Dr. Elisha Hammond about fatigue, weakness, anemia labs, and elevated liver enzymes. Her hemoglobin is 10.2 and ferritin is 4, meaning iron stores are very low. Dr. Hammond wants repeat labs in about 6 to 8 weeks, hematology follow-up with Dr. Miranda Bailey, GI follow-up with Dr. Meredith Grey, and no medication changes today.",
    },
  };

  return summaries[actionType] || {
    title: "Voithos360 prepared the next step.",
    steps: [
      "Reviewed the action details.",
      "Identified who likely needs to act.",
      "Prepared the next message, call script, or advocacy request.",
    ],
    next: "Ready for you to review.",
  };
}

export function isOpenAction(action) {
  return openActionStatuses.includes(String(action.status || "").toLowerCase());
}

export function buildActionCounts(actions = demoDetectedActions) {
  const openActions = actions.filter(isOpenAction);
  const closedCount = actions.length - openActions.length;

  return {
    openCount: openActions.length,
    closedCount,
    categoryCounts: openActions.reduce((counts, action) => {
      const key = action.actionType || "other";
      return { ...counts, [key]: (counts[key] || 0) + 1 };
    }, {}),
  };
}

export function buildDemoActionDetectionRun(actions = demoDetectedActions) {
  const counts = buildActionCounts(actions);

  return {
    totalPulled: actions.length + 3,
    openCount: counts.openCount,
    closedCount: counts.closedCount,
    excludedCount: 3,
    groupedCount: actions.length,
    sourceInputs: {
      tasks: "Mocked until EHR and care-plan APIs are connected",
      messages: "Mocked until portal messages are connected",
      forms: "Mocked until forms are connected",
      claims: "Mocked until payer data is connected",
      appointments: "Mocked until appointment feeds are connected",
      visitRecording: "Mocked until Visit Copilot extraction is connected",
    },
    categoryCounts: counts.categoryCounts,
    algorithmVersion: "open-action-detection-v1",
  };
}

export function daysUntilNextVisit(appointmentDate) {
  if (!appointmentDate) {
    return "14d";
  }

  const today = new Date();
  const target = new Date(`${appointmentDate}T00:00:00`);
  const diffMs = target.getTime() - today.setHours(0, 0, 0, 0);
  const days = Math.max(Math.ceil(diffMs / 86400000), 0);
  return `${days}d`;
}
