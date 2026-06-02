export const complexityWeights = {
  clinicalBurden: 0.25,
  careCoordinationBurden: 0.25,
  insuranceAdminBurden: 0.2,
  medicationBurden: 0.1,
  socialAccessBarriers: 0.1,
  caregiverBurden: 0.1,
};

export const demoComplexityInputs = {
  activeConditions: 3,
  medications: 6,
  specialists: 3,
  recentEmergencyOrHospitalVisits: 0,
  activePriorAuthorization: true,
  claimDenial: false,
  missedAppointment: false,
  caregiverInvolved: true,
  transportationOrAccessBarrier: false,
  costConcern: true,
  patientConfusionOrRepeatedQuestions: true,
  openCareGaps: 3,
  unresolvedTasks: 4,
};

export function classifyComplexity(score) {
  if (score >= 75) {
    return {
      label: "Very High Complexity",
      color: "red",
      recommendedSupportLevel: "High-touch navigation with urgent follow-up and caregiver alignment",
    };
  }

  if (score >= 50) {
    return {
      label: "High Complexity",
      color: "light red",
      recommendedSupportLevel: "Active navigation, task tracking, and help closing care gaps",
    };
  }

  if (score >= 25) {
    return {
      label: "Moderate Complexity",
      color: "yellow",
      recommendedSupportLevel: "Reminders, appointment preparation, and light coordination support",
    };
  }

  return {
    label: "Low Complexity",
    color: "green",
    recommendedSupportLevel: "Routine reminders and simple self-service support",
  };
}

export function scoreCareComplexity(inputs = demoComplexityInputs) {
  const documentationPoints = [
    { key: "activeConditions", points: inputs.activeConditions >= 3 ? 10 : 0, driver: "3 or more active conditions" },
    { key: "medications", points: inputs.medications >= 5 ? 10 : 0, driver: "5 or more medications" },
    { key: "activePriorAuthorization", points: inputs.activePriorAuthorization ? 15 : 0, driver: "Active prior authorization" },
    { key: "claimDenial", points: inputs.claimDenial ? 15 : 0, driver: "Claim denial" },
    { key: "specialists", points: inputs.specialists >= 3 ? 10 : 0, driver: "3 or more specialists" },
    { key: "missedAppointment", points: inputs.missedAppointment ? 10 : 0, driver: "Missed appointment" },
    { key: "caregiverInvolved", points: inputs.caregiverInvolved ? 10 : 0, driver: "Caregiver involved" },
    { key: "openCareGaps", points: inputs.openCareGaps > 0 ? 10 : 0, driver: "Open care gap" },
    { key: "costConcern", points: inputs.costConcern ? 10 : 0, driver: "Cost concern" },
  ];

  const rawDocumentationScore = documentationPoints.reduce((total, item) => total + item.points, 0);
  const score = Math.min(rawDocumentationScore, 100);
  const classification = classifyComplexity(score);

  const domainScores = {
    clinicalBurden: Math.min((inputs.activeConditions || 0) * 8 + (inputs.recentEmergencyOrHospitalVisits || 0) * 8, 25),
    careCoordinationBurden: Math.min((inputs.specialists || 0) * 6 + (inputs.unresolvedTasks || 0) * 2 + (inputs.openCareGaps || 0) * 2, 25),
    insuranceAdminBurden: Math.min((inputs.activePriorAuthorization ? 10 : 0) + (inputs.claimDenial ? 10 : 0) + (inputs.costConcern ? 5 : 0), 20),
    medicationBurden: Math.min((inputs.medications || 0) * 2, 10),
    socialAccessBarriers: Math.min((inputs.transportationOrAccessBarrier ? 7 : 0) + (inputs.costConcern ? 3 : 0), 10),
    caregiverBurden: Math.min((inputs.caregiverInvolved ? 6 : 0) + (inputs.patientConfusionOrRepeatedQuestions ? 4 : 0), 10),
  };

  const topDrivers = documentationPoints
    .filter((item) => item.points > 0)
    .sort((a, b) => b.points - a.points)
    .slice(0, 4)
    .map((item) => item.driver);

  return {
    score,
    label: classification.label,
    color: classification.color,
    confidenceScore: 0.72,
    recommendedSupportLevel: classification.recommendedSupportLevel,
    topDrivers,
    scoringInputs: inputs,
    domainScores,
    algorithmVersion: "care-complexity-v1",
  };
}

export function buildDemoOverviewSummary(firstName = "This patient", profile = {}) {
  const name = firstName && firstName !== "This patient" ? firstName : "You";
  const possessive = name === "You" ? "Your" : `${name}'s`;

  return `${possessive} last visit focused on fatigue, weakness, low iron anemia, elevated liver numbers, specialist referrals, and insurance questions. Voithos360 is tracking the iron treatment plan, when CBC/ferritin/iron studies and liver labs should be repeated, appointment follow-up, coverage checks, and caregiver updates so the most important steps do not get missed.`;
}

export function buildMvpCareSnapshot(profile = {}) {
  const age = Number(profile.ageYears || 0);
  const sex = String(profile.sex || "").toLowerCase();
  const ageText = age ? `${age}-year-old` : "new";
  const sexText = sex && sex !== "prefer_not_to_say" ? `${sex} ` : "";

  return `Your MVP care snapshot starts with your onboarding answers. Based on being a ${ageText} ${sexText}patient, Voithos360 is preparing age- and sex-related reminders for your first visit. As you upload labs or imaging, record visits, or ask for help, this summary will expand with plain-English next steps.`;
}

function providerTypeLabel(provider = {}) {
  const specialty = String(provider.specialty || "").trim();
  const name = String(provider.name || "").toLowerCase();

  if (/primary|pcp|family|internal/.test(specialty.toLowerCase()) || /primary|pcp/.test(name)) {
    return "primary care provider";
  }

  if (/cardio/.test(specialty.toLowerCase())) {
    return "cardiac specialist";
  }

  if (/gastro|gi/.test(specialty.toLowerCase())) {
    return "GI specialist";
  }

  if (/hematology|blood/.test(specialty.toLowerCase())) {
    return "hematology specialist";
  }

  if (specialty) {
    return `${specialty.toLowerCase()} specialist`;
  }

  return "provider";
}

function sexLabel(sex = "") {
  const normalized = String(sex || "").toLowerCase();

  if (normalized === "female") return "female";
  if (normalized === "male") return "male";
  if (normalized === "intersex") return "intersex";
  return "patient";
}

export function buildMvpPreVisitSummary({
  profile = {},
  providers = [],
  actions = [],
  clinicalEvents = [],
  advocacyRequests = [],
  caregiver = null,
} = {}) {
  const age = Number(profile.ageYears || 0);
  const agePhrase = age ? `${age}-year-old ${sexLabel(profile.sex)}` : `${sexLabel(profile.sex)} patient`;
  const primaryProvider =
    providers.find((provider) => provider.isPrimary) ||
    providers.find((provider) => provider.name === profile.primaryProviderName) ||
    providers[0] ||
    {};
  const providerType = providerTypeLabel(primaryProvider);
  const actionCount = actions.length;
  const clinicalCount = clinicalEvents.length;
  const advocacyCount = advocacyRequests.length;
  const hasCaregiver = Boolean(caregiver || profile.caregiverName || profile.caregiverEmail);

  const startingPoint = `Your pre-visit summary is prepared for a visit with your ${providerType}.`;
  const baseline =
    `Based on your onboarding answers, Voithos360 is starting with age- and sex-related reminders for a ${agePhrase}.`;

  const expansion = [];

  if (clinicalCount > 0) {
    expansion.push("uploaded labs, imaging, or recent clinical updates");
  }

  if (actionCount > 0) {
    expansion.push(`${actionCount} open next step${actionCount === 1 ? "" : "s"}`);
  }

  if (advocacyCount > 0) {
    expansion.push(`${advocacyCount} advocacy request${advocacyCount === 1 ? "" : "s"}`);
  }

  if (hasCaregiver) {
    expansion.push("caregiver sharing preferences");
  }

  if (!expansion.length) {
    return `${startingPoint} ${baseline} Bring up routine screenings, vaccines, medications if you take any, symptoms or concerns, and what follow-up you should complete after the visit. As you upload documents, record visits, or ask for help, this summary will update with more specific questions and next steps.`;
  }

  return `${startingPoint} ${baseline} Voithos360 is also incorporating ${expansion.join(", ")}. Use this visit to ask what needs attention first, what should be repeated or scheduled, and what should be shared with a caregiver after you approve it.`;
}
