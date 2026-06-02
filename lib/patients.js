export const patients = {
  jen: {
    initials: "JM",
    name: "Jen Morgan",
    risk: "High coordination load",
    riskClass: "chip-coral",
    context:
      "34 y/o with low iron, higher liver blood tests, diabetes, recent cancer care, and specialist visits to schedule.",
    metrics: ["8", "3", "2d"],
    actions: [
      {
        level: "urgent",
        title: "Book both specialist visits and ask what to do first",
        detail:
          "Your doctor mentioned a blood specialist and a stomach/liver specialist. Ask if both should be scheduled now and which one is most urgent.",
      },
      {
        level: "soon",
        title: "Get repeat blood work at an in-network lab",
        detail:
          "Your low iron and liver blood tests need another look. Voithos360 found the lab option that should cost less with your insurance.",
      },
      {
        level: "normal",
        title: "Prepare a second-opinion summary",
        detail:
          "If you want another doctor to review your treatment plan, Voithos360 can make a simple summary of your records and questions.",
      },
      {
        level: "normal",
        title: "Share the visit plan with your caregiver",
        detail:
          "Send Maya a short update with what happened, what needs to be scheduled, and what symptoms to watch for.",
      },
    ],
    timeline: [
      ["clinical", "Low iron needs follow-up", "Voithos360 linked this to your blood specialist referral."],
      ["clinical", "Liver blood tests need clarification", "Ask which repeat tests should happen before the specialist visit."],
      ["financial", "In-network options found", "Three blood specialists were found within 12 miles."],
      ["clinical", "Visit questions prepared", "Questions focus on repeat labs, timing, and warning signs."],
    ],
    sources: [
      ["MyChart oncology", 92],
      ["Primary care portal", 87],
      ["Lab partner", 76],
      ["Insurance portal", 64],
    ],
    gaps: [
      "The referral notes do not say which specialist visit is most urgent.",
      "A scan report is mentioned but not attached.",
      "Insurance cost information does not match across two pages.",
    ],
    questions: [
      "Should I see the blood specialist and stomach/liver specialist around the same time?",
      "Which blood tests do I need to repeat before those appointments?",
      "What warning signs mean I should call right away or go to urgent care?",
    ],
    transcript: [
      ["Provider", "Your iron is very low and your liver blood tests are higher than expected. I want to understand those first before we change your diabetes medicine."],
      ["Voithos360", "You may want to ask: should I book both specialist visits now, and which repeat blood tests should I get before I go?"],
    ],
    caregivers: [
      ["MF", "Maya received the visit summary.", "12 min ago"],
      ["FF", "Felice reviewed the specialist shortlist.", "1 hr ago"],
    ],
  },
  robert: {
    initials: "RC",
    name: "Robert Cruz",
    risk: "Preventive care restart",
    riskClass: "chip-live",
    context:
      "52 y/o returning to primary care after three years; needs routine screenings, basic blood work, and benefits guidance.",
    metrics: ["5", "2", "5d"],
    actions: [
      {
        level: "soon",
        title: "Bring up routine screenings at your visit",
        detail:
          "Ask which screenings and basic blood tests are due this year, including colon screening, cholesterol, diabetes, and blood pressure checks.",
      },
      {
        level: "normal",
        title: "Gather your older health records",
        detail: "Voithos360 can pull in older portal information so your doctor has a clearer starting point.",
      },
      {
        level: "normal",
        title: "Check what the visit and labs may cost",
        detail: "Review your copay, deductible, and preferred lab options before the appointment so there are fewer surprises.",
      },
    ],
    timeline: [
      ["clinical", "First PCP appointment scheduled", "Voithos360 prepared a simple first-visit plan."],
      ["financial", "Benefits summary available", "PCP copay and preventive care coverage verified."],
      ["clinical", "Screening reminders ready", "Age-appropriate screenings have been added to the visit checklist."],
    ],
    sources: [
      ["Primary care portal", 68],
      ["Insurance portal", 82],
      ["Preferred lab partner", 55],
    ],
    gaps: ["No recent lab history found.", "Medication list needs your confirmation."],
    questions: [
      "Which routine screenings am I due for this year?",
      "Can we order basic blood work today so we have a starting point?",
      "What should I keep an eye on before my next visit?",
    ],
    transcript: [
      ["Provider", "Since it has been a few years, let’s restart with basic blood work and make sure your routine screenings are up to date."],
      ["Voithos360", "You may want to ask: which screenings are due for my age, and can today’s visit include the lab orders I need?"],
    ],
    caregivers: [["RC", "Robert reviewed his pre-visit checklist.", "10 min ago"]],
  },
  kelso: {
    initials: "RK",
    name: "Robert Kelso",
    risk: "Medication refill support",
    riskClass: "chip-coral",
    context:
      "74 y/o with chronic back pain, diabetes, cholesterol medicine refill needs, overdue routine care, and insurance approval steps.",
    metrics: ["9", "5", "11/19"],
    actions: [
      {
        level: "urgent",
        title: "Get liver blood tests for cholesterol refill",
        detail:
          "Your cholesterol medicine refill may need updated liver blood tests first. Voithos360 can help send the reminder and ask your doctor to order them.",
      },
      {
        level: "urgent",
        title: "Ask what is needed for your pain medicine refill",
        detail:
          "Because this medicine has extra safety rules, ask whether you need an office visit, a urine test, or a new pain review before it can be refilled.",
      },
      {
        level: "soon",
        title: "Start the pain management referral",
        detail:
          "Voithos360 can help track the referral so you know when it is approved and who to call for scheduling.",
      },
      {
        level: "soon",
        title: "Help insurance approve the new diabetes/weight medicine",
        detail:
          "Insurance may ask for proof of your diabetes, weight history, recent A1C, and past treatments. Voithos360 can help organize that information.",
      },
      {
        level: "normal",
        title: "Schedule overdue routine care",
        detail:
          "Before you leave the visit, ask for help scheduling your colonoscopy and checking which vaccines or screenings are due.",
      },
    ],
    timeline: [
      ["clinical", "Back pain follow-up prepared", "Your care plan includes a pain management referral."],
      ["clinical", "Pain medicine safety steps flagged", "Voithos360 lists what may be needed before refill."],
      ["clinical", "Diabetes blood work ordered", "A1C monitoring is due."],
      ["financial", "Insurance approval needed", "The new diabetes/weight medicine needs supporting information."],
    ],
    sources: [
      ["7 Hills Department note", 91],
      ["Medication list", 84],
      ["Lab monitoring panel", 72],
      ["Insurance approval queue", 46],
    ],
    gaps: [
      "Recent liver blood tests are missing for cholesterol medicine refill.",
      "A urine drug screen may be needed before pain medicine refill.",
      "Pain management referral has not been approved yet.",
      "Colonoscopy has not been scheduled.",
    ],
    questions: [
      "Can we order the liver blood tests today so my cholesterol medicine refill can move forward?",
      "What do I need to do before my pain medicine can be refilled safely?",
      "Should we send referrals for pain management, physical therapy, and weight support at the same time?",
      "What information does insurance need before it will approve the new diabetes/weight medicine?",
    ],
    transcript: [
      ["Provider", "Robert, today we need to talk about your back pain, medication refills, diabetes follow-up, and a few routine screenings you are due for."],
      ["Voithos360", "You may want to ask: what steps are needed for my cholesterol refill, what is required for my pain medicine refill, and what does insurance need for the new diabetes/weight medicine?"],
    ],
    caregivers: [
      ["LD", "Refill queue reminder sent about liver blood tests.", "Just now"],
      ["RK", "Robert received the lab work reminder.", "18 min ago"],
    ],
  },
};

export const estimates = {
  hematology: { in: "$90-$160", out: "$420-$680" },
  gi: { in: "$120-$210", out: "$540-$820" },
  labs: { in: "$35-$85", out: "$180-$340" },
};
