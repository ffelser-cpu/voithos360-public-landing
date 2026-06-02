export const fallbackVisitAnalysis = {
  plainEnglishSummary:
    "Your visit focused on fatigue, weakness, low iron anemia, elevated liver numbers, and follow-up planning. The provider said repeat labs are needed in about 6 weeks, current medicines should continue for now, and hematology/GI follow-up should be scheduled.",
  providerExplanation: [
    {
      providerSaid: "Your hemoglobin is 10.2 and hematocrit is 33.",
      plainEnglish: "Your red blood count is low, which can help explain feeling tired or weak.",
    },
    {
      providerSaid: "Your ferritin is 4 and iron saturation is 12%.",
      plainEnglish: "Your stored iron and available iron are very low, which fits iron deficiency anemia.",
    },
    {
      providerSaid: "Repeat CBC, ferritin, iron studies, and liver enzymes in about 6 weeks.",
      plainEnglish: "You need repeat blood work so your care team can see whether the anemia, iron levels, and liver numbers are improving.",
    },
  ],
  detectedAnswers: [
    "Repeat CBC, ferritin, iron studies, and liver enzymes in about 6 weeks.",
    "Continue current medicines for now unless the care team changes the plan.",
    "Schedule hematology and GI follow-up within the next month.",
  ],
  nextActions: [
    {
      title: "Add repeat lab reminder",
      detail: "Repeat CBC, ferritin, iron studies, and liver enzymes in about 6 weeks.",
      owner: "patient",
      actionType: "lab/imaging",
      requiresApproval: false,
    },
    {
      title: "Schedule specialist follow-up",
      detail: "Schedule hematology and GI follow-up within the next month.",
      owner: "patient",
      actionType: "appointment",
      requiresApproval: false,
    },
    {
      title: "Review caregiver update",
      detail: "Voithos360 prepared a caregiver update for approval before sending.",
      owner: "patient",
      actionType: "caregiver",
      requiresApproval: true,
    },
  ],
  caregiverUpdateDraft: {
    requiresApproval: true,
    message:
      "The visit focused on fatigue, weakness, low iron anemia, and liver blood tests. The provider wants repeat labs in about 6 weeks and hematology/GI follow-up within the next month. Medicines are continuing for now.",
  },
  documentsRequiringApproval: [
    {
      type: "post_visit_summary",
      title: "Post-visit summary",
      message:
        "Your visit focused on low iron anemia, elevated liver numbers, repeat labs, and specialist follow-up.",
    },
    {
      type: "caregiver_update",
      title: "Caregiver update",
      message:
        "The visit focused on fatigue, low iron anemia, repeat labs, and specialist follow-up. No medication changes were made today.",
    },
  ],
  qa: {
    confidenceScore: 0.58,
    evidenceScore: 0.5,
    rationale: "Fallback MVP analysis used because LLM analysis was unavailable.",
  },
};

const visitAnalysisSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "plainEnglishSummary",
    "providerExplanation",
    "detectedAnswers",
    "nextActions",
    "caregiverUpdateDraft",
    "documentsRequiringApproval",
    "qa",
  ],
  properties: {
    plainEnglishSummary: { type: "string" },
    providerExplanation: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["providerSaid", "plainEnglish"],
        properties: {
          providerSaid: { type: "string" },
          plainEnglish: { type: "string" },
        },
      },
    },
    detectedAnswers: {
      type: "array",
      items: { type: "string" },
    },
    nextActions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "detail", "owner", "actionType", "requiresApproval"],
        properties: {
          title: { type: "string" },
          detail: { type: "string" },
          owner: { type: "string" },
          actionType: { type: "string" },
          requiresApproval: { type: "boolean" },
        },
      },
    },
    caregiverUpdateDraft: {
      type: "object",
      additionalProperties: false,
      required: ["requiresApproval", "message"],
      properties: {
        requiresApproval: { type: "boolean" },
        message: { type: "string" },
      },
    },
    documentsRequiringApproval: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["type", "title", "message"],
        properties: {
          type: { type: "string" },
          title: { type: "string" },
          message: { type: "string" },
        },
      },
    },
    qa: {
      type: "object",
      additionalProperties: false,
      required: ["confidenceScore", "evidenceScore", "rationale"],
      properties: {
        confidenceScore: { type: "number" },
        evidenceScore: { type: "number" },
        rationale: { type: "string" },
      },
    },
  },
};

function extractResponseText(payload) {
  if (payload?.output_text) {
    return payload.output_text;
  }

  const output = payload?.output || [];

  for (const item of output) {
    for (const content of item.content || []) {
      if (content.type === "output_text" && content.text) {
        return content.text;
      }
    }
  }

  return "";
}

export async function analyzeVisitTranscript({ transcript, patientContext = {} }) {
  if (!process.env.OPENAI_API_KEY || !transcript) {
    return fallbackVisitAnalysis;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text:
                  "You are Voithos360, a patient-facing healthcare visit copilot. Convert visit transcript text into plain English. Do not create a new diagnosis or treatment plan beyond what the transcript supports. Use warm, clear language. Do not show confidence scores to the patient. Anything outbound requires approval.",
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: JSON.stringify({
                  transcript,
                  patientContext,
                  task:
                    "Return the required JSON only. Summarize what was said, translate medical language, detect provider answers, create next actions, draft caregiver update if useful, and include QA scores/rationale for backend storage.",
                }),
              },
            ],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "visit_copilot_analysis",
            strict: true,
            schema: visitAnalysisSchema,
          },
        },
      }),
    });

    if (!response.ok) {
      return fallbackVisitAnalysis;
    }

    const payload = await response.json();
    const responseText = extractResponseText(payload);

    if (!responseText) {
      return fallbackVisitAnalysis;
    }

    return JSON.parse(responseText);
  } catch (error) {
    return fallbackVisitAnalysis;
  }
}
