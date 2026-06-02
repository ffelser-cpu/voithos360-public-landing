# Beta Milestone 3: Visit Copilot

## Goal

Build the patient-facing Visit Copilot experience so a beta user can start visit mode, see a live/plain-English visit support experience, capture important provider answers, and turn the visit into next actions, summaries, and approved outbound documents.

## Entry Point

- The overview screen must include a clickable "Start visit mode" box/button.
- Clicking "Start visit mode" takes the user to the Visit Copilot module.
- The route should be `/copilot`.

## First Screen

- The first section should read:
  - "Ambient visit support"
  - "Live visit copilot"
- The module should include:
  - "Begin listening" button
  - "Pause" button
- Layout, language, and spacing should follow the existing prototype as closely as possible.

## Recording Behavior

- The app should let the user begin recording or simulating a patient/provider conversation.
- For beta, recording can be browser-based or mocked.
- The UI should behave like a real visit recorder even if transcription is initially simulated.
- The system should show recording/listening state clearly.
- The user should be able to pause listening.

## Consent And Notice

- Before recording begins, the app must show a simple reminder that the user is responsible for getting permission to record where required.
- The reminder should be plain English and not overly legalistic.
- The user should acknowledge the reminder before listening begins.
- When "Begin listening" is pressed, the app should display a warning popup that says: "Reminder to obtain consent prior to recording".
- The popup should include a "Consent obtained" button.
- After the user clicks "Consent obtained", the recorder can be started.
- This consent notice must appear before every new recording.
- The notice should not reappear when an active recording is only paused.
- Once recording is stopped, the transcript should be uploaded into documents.
- After stop, the Provider section should show the plain-English translation and the Voithos360 response should appear beneath it.

## Live Transcript

- The app should show a live or simulated transcript during and/or after the visit.
- The transcript should preserve enough detail to support post-visit summarization and action detection.
- The transcript should be stored in the backend once the session ends or is saved.

## Provider Section

- The system should record and show what the provider is saying in the Provider section.
- The Provider section should translate or restate provider language in plain English for the patient.
- The Provider section should avoid medical abbreviations when possible.

## Voithos360 Section

- The system must show immediate questions to ask before the user leaves the office.
- Questions should be based on:
  - Health gaps
  - Lab results
  - Imaging reports
  - Open actions
  - Visit reason
  - Provider specialty
  - Prior visit or care-plan context when available
- The user should be able to use or dismiss suggested questions.
- Suggested questions should remain plain-English and patient-facing.

## Plain-English Translation

- Voithos360 should convert medical language from the visit into patient-facing plain English.
- Examples:
  - "CBC and CMP" becomes "blood tests that check blood counts, liver, kidney, and body chemistry."
  - "Repeat labs in 2 weeks" becomes "get another blood test in about 2 weeks so your care team can see if things are improving."

## Detect Provider Answers

- If the provider gives an answer that creates a next step, Voithos360 should detect it.
- Example provider answer: "Repeat CBC and CMP in 2 weeks."
- Voithos360 should explain that in plain English and convert it into a next action.
- Detected answers should be stored with the visit session.

## Auto-Created Next Actions

After or during the visit, Voithos360 should create next best actions from the conversation when appropriate.

Examples:

- Add lab reminder
- Schedule follow-up
- Message provider
- Call lab
- Share summary with caregiver
- Check prior authorization
- Add appointment/calendar reminder

Generated actions should appear in "Next best actions" and be stored in the backend.

## Post-Visit Summary

Voithos360 should generate a plain-English post-visit summary that includes:

- Who was seen
- Provider specialty, when available
- Date of visit
- Why the visit happened
- What was discussed
- Medication changes
- Lab changes or orders
- Imaging findings or follow-up
- Referrals
- Follow-up instructions
- What the patient should do next

The summary should reduce confusion, clarify next steps, and identify unresolved actions.

## Approval Before Sending

- If Voithos360 prepares a caregiver update, provider message, insurance document, or other outbound document, the user must see it before it is sent.
- The user must have an approval/send control.
- Once approved, the document is marked as sent and stored.
- Caregiver-sharing documents must be available later in settings under documents.

## Storage Requirements

The backend should store:

- Visit session
- Visit date
- Provider name, when available
- Provider specialty, when available
- Transcript
- Plain-English summary
- Extracted questions
- Detected provider answers
- Generated actions
- Generated documents
- Approval history
- Sent history

Existing schema support:

- `VisitCopilotSession`
- `VisitCopilotAction`
- `CareAction`
- `CareActionHistory`

Additional storage may be needed for generated visit documents and extracted questions if they need to be queried separately from action history.

## Measurable Impact On Overview

- The measurable impact section must be visible on the overview page in the same manner as the prototype.
- The measurable impact section should include:
  - Avoidable delays flagged
  - Estimated cost exposure clarified
  - Caregiver updates sent
- These counts should be driven by stored events/actions when available.
- The above Visit Copilot actions must count toward measurable impact.
- Impact data must be stored in the backend for reporting.

Existing schema support:

- `ImpactMetric`
- `CareActionHistory`
- `CareAction`

## Action History

The system should store history whenever Voithos360:

- Prepares a message
- Prepares a document
- Suggests a next step
- Converts visit conversation into an action
- Sends an approved document
- Marks an action complete
- Shares a caregiver update
- Adds a reminder
- Adds or prepares a calendar item

Action history should include:

- Event type
- Summary
- Status
- Related care action, when applicable
- Recipient, when applicable
- Source visit session, when applicable
- Metadata needed for reporting
- Timestamp

## Mock Data For First Beta Patient

Before live EHR integration, seed a realistic first beta patient experience with:

- Jen Morgan, age 34
- Type 2 diabetes
- History of breast cancer resolved after lumpectomy
- Chronic anemia
- Elevated liver enzymes
- New fatigue and weakness
- Primary care provider visit with Dr. Elisha Hammond
- GI specialist referral to Dr. Meredith Grey at GI Associates of Seattle
- Hematology specialist referral to Dr. Miranda Bailey at Grey-Sloan Hematology
- Insurance plan: Aetna PPO
- Current medications:
  - Mounjaro 5 mg once weekly by injection
  - Metformin 1000 mg by mouth twice daily
  - Xanax 0.5 mg by mouth up to three times daily as needed for anxiety
- Caregiver/family member: Alicia Morgan, Jen's mom
- One upcoming visit or visit reason
- One provider and specialty
- Simulated provider transcript
- Simulated patient/provider conversation
- A few provider statements that create next steps
- Suggested questions to ask before leaving
- One detected lab follow-up action
- One detected imaging follow-up action
- One scheduling action
- One insurance/prior authorization check
- One caregiver-shareable post-visit summary
- Measurable impact counts:
  - Avoidable delays flagged
  - Estimated cost exposure clarified
  - Caregiver updates sent

Mock data should look real to the patient but be clearly replaceable once EHR, transcription, calendar, messaging, and insurance APIs are connected.

### Jen Morgan Lab-Based Mock Visit

For the first beta patient, Jen Morgan, the Visit Copilot mock session should include her CBC and iron study pattern:

- Hemoglobin 10.2 g/dL, low
- Hematocrit 33.0%, low
- MCH 25.4 pg, low
- MCHC 30.9 g/dL, low
- Iron saturation 12%, low
- Ferritin 4 ng/mL, low
- White blood cell count 5.0, normal
- Platelets 288, normal
- Reticulocyte count 1.5%, normal

Patient-facing interpretation:

- "Your labs look like iron deficiency anemia."
- "Your stored iron is very low, and your red blood numbers are low."
- "Your white blood cells and platelets are normal, which is reassuring."

The visit transcript should discuss:

- Why the iron may be low
- Whether oral iron or IV iron is recommended
- Whether additional testing is needed for bleeding, absorption, diet, or menstrual causes
- When CBC, ferritin, and iron studies should be repeated
- What symptoms should prompt the patient to call sooner

The generated next actions should include:

- Confirm iron treatment plan
- Add repeat CBC/ferritin/iron studies reminder
- Ask where repeat labs should be completed
- Prepare caregiver-friendly lab summary for approval
- Check whether prior authorization may be needed after consult
- Check benefit coverage for specialist visit
- Estimate in-network versus out-of-network cost exposure
- Confirm deductible status

## Measurable Impact Rules

Avoidable delays flagged should count signals such as:

- Prior authorization not initiated
- Missing documentation for approval
- Insurance eligibility issue
- Schedule backlog
- Status unchanged
- Missing payer or provider response
- Open tasks with due dates

Cost exposure clarified should count signals such as:

- Missed follow-up appointments
- Delayed imaging
- Unmanaged chronic disease
- Out-of-network referral
- Coverage lapse
- Claim denials
- Large patient bills
- Multiple specialists ordering the same tests

For ROI reporting, cost exposure clarified should also support an estimated dollar value. In the beta mock, Jen Morgan's cost exposure estimate is $2,450, built from:

- Potential out-of-network specialist exposure: $1,200
- Deductible exposure: $750
- Possible duplicate repeat-lab risk: $250
- Delayed follow-up risk: $250

Caregiver updates sent should count the number of caregiver updates the user approves and sends.

## UAT Acceptance Criteria

- User can click "Start visit mode" from overview.
- User lands on Visit Copilot.
- User sees "Ambient visit support" and "Live visit copilot."
- User sees Begin listening and Pause controls.
- User sees a recording permission reminder before listening begins.
- User can begin a mocked or browser-based listening session.
- User sees provider/plain-English content.
- User sees suggested questions to ask before leaving.
- User sees transcript content.
- User sees detected provider answers translated into plain English.
- User sees generated next actions.
- User sees a post-visit summary.
- User sees any outbound document before approval.
- Approved/sent items are stored in action history.
- Visit actions contribute to measurable impact.
