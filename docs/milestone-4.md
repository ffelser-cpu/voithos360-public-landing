# Beta Milestone 4

Source of truth: Milestone 4 tab from the shared Google Sheet.

## Confirmed Requirements

| Feature | Action | Displays |
| --- | --- | --- |
| Consent notice | Popup reminder every time a new recording is started | Reminder to obtain permission to record prior to recording session |
| Transcript (for mock visit) | Have visible transcript of provider conversation with patient | Provider: I'm concerned about your labs. Your iron is very low and your liver enzymes are high. Additionally your hemoglobin and hematocrit are of concern. I want to send you to several specialists, GI, hematology, and a liver specialist. Voithos360: You may want to ask: should I book all the specialist visits now, and which repeat blood tests should I get before I go? |
| Patient/provider conversation | Regarding the lab work that is input into the mock data | To be shown through the mock transcript and visit copilot experience |

## Open Milestone 4 Items From Sheet

The Milestone 4 tab lists these sections but does not yet provide final action/display details:

- Provider plain-English section
- What Voithos should translate from the provider's words
- Questions to ask
- What questions should appear before the patient leaves the office
- Detected answers
- What provider answers should Voithos pick up and turn into actions
- Generated next actions
- What exact actions should appear after the visit
- Post-visit summary
- What the summary should say or include
- Approval/send documents
- Which documents should require approval, such as caregiver update, provider message, insurance form
- Measurable impact
- What should count as avoidable delay, cost exposure clarified, caregiver update sent
- Mock first beta patient
- Whether the mock patient context is Jen Morgan or a new beta patient

## Implementation Guardrail

Do not fill Milestone 4 gaps from earlier milestone notes unless the user explicitly says to reuse them. Until then, only the confirmed rows above should drive implementation.
