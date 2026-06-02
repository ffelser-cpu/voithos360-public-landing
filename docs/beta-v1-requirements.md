# Voithos360 Beta v1 Requirements

## Audience

Beta v1 is patient-facing only. Caregivers, providers, and advocates may appear in the product as people the patient manages or communicates with, but they do not need separate accounts in v1.

## Core Promise

A patient can create an account, give required consents, complete one-time intake, view a plain-English care dashboard, use visit copilot during a provider visit, and approve Voithos360-prepared next steps.

## End-to-End Beta Flow

1. Patient creates an account or logs in.
2. New patient accepts data rights consent and HIPAA authorization by checkbox.
3. New patient completes one-time intake.
4. Patient lands on the care dashboard.
5. Dashboard shows health gaps, open actions, next appointment, providers, caregiver, and insurance status.
6. Patient opens Visit Copilot and starts ambient listening during a patient/provider visit.
7. Copilot turns the visit conversation into plain English.
8. Voithos360 suggests next actions such as add to calendar, set up appointment, call lab, prepare message, or create a document.
9. Patient approves or dismisses each suggested action.
10. Approved actions are stored in action history.

## Must Work In Beta

- Signup and login
- Consent capture after account creation
- One-time intake after consent
- Dashboard
- Health gaps
- Open actions
- Visit copilot
- Advocacy requests
- Settings
- Provider list
- Insurance card upload

## Mocked In Beta

- EHR data
- AI actions
- Provider messages
- Insurance verification
- Visit ambient recording and transcription

Mocked workflows should still look and feel like real product behavior: Voithos360 should identify the issue, prepare the next step, and ask the patient to approve before sending, scheduling, or sharing.

## Must Be Stored

- Consent records
- Intake profile
- Caregiver name
- Provider list
- Insurance card metadata and storage reference
- Action history
- Advocacy requests
- Visit copilot sessions, transcript text, plain-English summary, and suggested actions

## Product Language Rules

- Patient-facing, plain English
- Avoid clinical shorthand unless the app explains it
- Prefer action language over explanation-only language
- Do not say only what Voithos360 would do; show Voithos360 preparing the action
- Ask for patient approval before external-facing steps

## Initial Data Model

- `ConsentRecord`: data rights and HIPAA authorization acceptance
- `IntakeProfile`: first name, last name, date of birth, ZIP code, email, optional caregiver, optional primary provider
- `ProviderProfile`: EHR-derived or patient-added providers
- `InsuranceCard`: uploaded insurance card file metadata and storage URL
- `CareAction`: open actions shown on the dashboard
- `CareActionHistory`: action approvals, completions, created documents, and sent messages
- `CareGap`: health gaps shown on the dashboard
- `ImpactMetric`: ROI/measurable impact signals, displayed values, calculation logic, source inputs, linked actions/gaps, and reporting period
- `AdvocacyRequest`: patient requests and Voithos360 responses
- `VisitCopilotSession`: visit recording/transcript/plain-English summary
- `VisitCopilotAction`: suggested next steps from the visit

## First Build Milestones

1. Auth, consent, and intake gating
2. Persisted dashboard shell
3. Settings for profile, caregiver, providers, and insurance card
4. Advocacy request creation and response mock
5. Visit copilot mock session with generated plain-English summary
6. Patient approval workflow and action history
7. Replace mocked EHR data with SMART on FHIR sandbox data where available

## Milestone Requirement Documents

- `docs/milestone-1-auth-consent-intake.md`
- `docs/milestone-2-overview.md`
- `docs/open-actions-complexity-source.csv`
- `docs/google-sheet-overview.csv`
- `docs/google-sheet-ai-actions.csv`
- `docs/google-sheet-denied-claim-risk.csv`
- `docs/google-sheet-health-gaps.csv`
- `docs/google-sheet-ai-action-automation-levels.csv`
- `docs/google-sheet-lab-interpretation-engine.csv`
- `docs/google-sheet-imaging-rules.csv`
- `docs/appendix-c-lab-interpretation-engine.md`
- `docs/appendix-d-imaging-interpretation-engine.md`
