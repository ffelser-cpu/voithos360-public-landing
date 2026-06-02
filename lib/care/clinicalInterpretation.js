export const jenMorganLabResults = [
  { panel: "CBC", test: "White blood cell count", value: "5.0", unit: "Thousand/uL", range: "3.8-10.8", flag: "normal" },
  { panel: "CBC", test: "Red blood cell count", value: "4.02", unit: "Million/uL", range: "3.80-5.10", flag: "normal" },
  { panel: "CBC", test: "Hemoglobin", value: "10.2", unit: "g/dL", range: "11.7-15.5", flag: "low" },
  { panel: "CBC", test: "Hematocrit", value: "33.0", unit: "%", range: "35.9-46.0", flag: "low" },
  { panel: "CBC", test: "MCV", value: "82.1", unit: "fL", range: "81.4-101.7", flag: "normal" },
  { panel: "CBC", test: "MCH", value: "25.4", unit: "pg", range: "27.0-33.0", flag: "low" },
  { panel: "CBC", test: "MCHC", value: "30.9", unit: "g/dL", range: "31.6-35.4", flag: "low" },
  { panel: "CBC", test: "RDW", value: "14.6", unit: "%", range: "11.0-15.0", flag: "normal" },
  { panel: "CBC", test: "Platelet count", value: "288", unit: "Thousand/uL", range: "140-400", flag: "normal" },
  { panel: "Iron studies", test: "Iron, total", value: "49", unit: "mcg/dL", range: "40-190", flag: "normal-low" },
  { panel: "Iron studies", test: "Iron binding capacity", value: "417", unit: "mcg/dL", range: "250-450", flag: "normal-high" },
  { panel: "Iron studies", test: "Iron saturation", value: "12", unit: "%", range: "16-45", flag: "low" },
  { panel: "Ferritin", test: "Ferritin", value: "4", unit: "ng/mL", range: "16-154", flag: "low" },
  { panel: "Reticulocyte count", test: "Reticulocyte count", value: "1.5", unit: "%", range: "not shown", flag: "normal" },
  { panel: "Reticulocyte count", test: "Reticulocyte absolute", value: "60300", unit: "cells/uL", range: "20000-80000", flag: "normal" },
];

export const demoClinicalTimeline = [
  {
    type: "clinical",
    title: "Iron deficiency anemia pattern needs follow-up",
    detail:
      "Jen's recent labs show anemia and very low iron stores: hemoglobin is 10.2, hematocrit is 33.0, iron saturation is 12%, and ferritin is 4. In plain English, this looks like iron deficiency anemia. White blood cells and platelets are normal. Voithos360 is tracking Dr. Elisha Hammond's treatment plan, what may be causing the low iron, and when to repeat the blood work.",
    source: "lab_interpretation",
    confidenceScore: 0.9,
    evidenceScore: 0.88,
    rationale:
      "Low hemoglobin and hematocrit with low MCH/MCHC, very low ferritin, and low iron saturation supports an iron deficiency anemia pattern. White blood cell and platelet counts are normal.",
  },
  {
    type: "clinical",
    title: "Elevated liver numbers need follow-up",
    detail:
      "Jen also has liver-related blood tests that are higher than expected. Voithos360 is tracking Dr. Hammond's plan for Dr. Meredith Grey at GI Associates of Seattle to review the results, whether more testing is needed, and when the numbers should be repeated.",
    source: "imaging_interpretation",
    modality: "CT",
    bodyRegion: "liver",
    findingClass: "follow up recommended",
    trend: "no prior comparison",
    urgency: "follow up needed",
    keyFindings: {
      anatomy: "liver",
      abnormality: "elevated liver-related blood tests",
      laterality: "not specified",
      severity: "needs follow-up",
      timing: "repeat testing and specialty review recommended",
    },
    confidenceScore: 0.73,
    evidenceScore: 0.69,
    rationale:
      "Mock interpretation uses elevated liver enzyme follow-up language to classify urgency and create plain-English next steps until live clinical data is connected.",
  },
];

export const demoFinancialTimeline = [
  {
    type: "financial",
    title: "Insurance approval may be needed",
    detail:
      "Voithos360 found that Aetna PPO may need to confirm whether the hematology or GI visits require approval before they are scheduled. The next step is to ask the provider office or insurance plan whether prior authorization is required and what information they need.",
    source: "insurance_workflow",
    confidenceScore: 0.74,
    evidenceScore: 0.7,
    rationale:
      "Updated AI action rules indicate prior authorization should be checked for planned procedures or medications when payer requirements may apply.",
  },
  {
    type: "financial",
    title: "Cost and network check should happen before scheduling",
    detail:
      "Before the appointment is booked, Voithos360 is tracking whether Dr. Miranda Bailey and Dr. Meredith Grey are in network for Aetna PPO, whether Jen's deductible has been met, and whether there may be a lower-cost option.",
    source: "benefits_workflow",
    confidenceScore: 0.7,
    evidenceScore: 0.64,
    rationale:
      "Updated AI action rules recommend checking in-network status, estimated cost, and lower-cost options before scheduling when benefit data is available.",
  },
];

export const demoClinicalActions = [
  {
    title: "Ask about the iron deficiency anemia plan",
    detail:
      "Ask what is causing the low iron, whether treatment should start now, and when CBC, ferritin, and iron studies should be repeated.",
    level: "soon",
    actionType: "lab/imaging",
    owner: "care team",
    status: "new",
    dueDate: "2026-05-15",
    visitDate: "2026-05-18",
    visitLabel: "Visit with Dr. Elisha Hammond",
    foundFrom: "Voithos360 found this by reading Jen's CBC, iron saturation, and ferritin together.",
    confidenceScore: 0.9,
    evidenceScore: 0.88,
    rationale: "Low hemoglobin, low hematocrit, low MCH/MCHC, iron saturation 12%, and ferritin 4 support iron deficiency anemia follow-up.",
  },
  {
    title: "Confirm the elevated liver number follow-up plan",
    detail:
      "Ask whether Dr. Meredith Grey should review the elevated liver numbers, whether more testing or imaging is needed, and when liver labs should be repeated.",
    level: "soon",
    actionType: "lab/imaging",
    owner: "care team",
    status: "new",
    dueDate: "2026-05-18",
    visitDate: "2026-05-18",
    visitLabel: "Visit with Dr. Elisha Hammond",
    foundFrom: "Voithos360 found this from the elevated liver enzyme follow-up plan.",
    confidenceScore: 0.73,
    evidenceScore: 0.69,
    rationale: "Elevated liver-related blood tests and the specialist referral plan suggest follow-up should be clarified with the care team.",
  },
];

export function classifyImagingFinding({ findingClass = "", trend = "", urgency = "" } = {}) {
  return {
    findingClass,
    trend,
    urgency,
    patientFacing:
      "Voithos360 summarizes imaging reports in plain English and adds next steps when the report suggests follow-up, urgent review, or comparison with prior imaging.",
  };
}

export function buildClinicalInterpretationSummary() {
  return {
    confidenceScore: 0.72,
    evidenceScore: 0.68,
    rationale:
      "Demo interpretation combines lab trends, imaging report sections, comparison language, and whether follow-up is recommended. Rationale is stored for audit and quality review, not shown to the patient.",
  };
}
