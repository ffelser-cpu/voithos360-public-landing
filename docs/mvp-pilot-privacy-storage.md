# MVP Pilot Privacy Storage Rules

Voithos360 MVP pilot storage should preserve the reporting value of the product while reducing unnecessary storage of sensitive raw data.

These rules are implemented as an MVP privacy mode, not as a permanent removal
of future functionality. When production security, BAA coverage, file storage,
and audit controls are in place, richer storage can be re-enabled by setting:

```text
MVP_PRIVACY_MODE=false
```

## MVP product scope

The MVP pilot should prove the patient-facing workflow without requiring live EHR, scheduling, insurance, lab, or imaging APIs on day one.

Included in MVP:

- Clerk login and account access.
- Onboarding questionnaire with MVP privacy mode.
- Overview built from onboarding answers first, then expanded by uploads, visits, advocacy requests, caregiver actions, and user-approved documents.
- Pre-visit summary that starts with age- and sex-related reminders and expands after visits or uploaded records.
- Visit Copilot recording flow, plain-English translation, patient summary, caregiver summary, generated actions, and approval-before-send workflows.
- Advocacy request workflow.
- Caregiver workflow with secure expiring share links.
- Lab and imaging document upload for temporary OCR/LLM review until live data feeds are connected.

Turned off in MVP:

- Benefits module and live cost estimates until insurance eligibility, network, deductible, and cost-estimate data are connected.

## Identity and intake

- Do not use full name for pilot reporting while MVP privacy mode is enabled.
- Store a masked participant code for backend linkage.
- Store age in years for reporting while MVP privacy mode is enabled.
- Store DOB as year-only masked date, for example `xx/xx/1972` represented internally as `1972-01-01`, so the pilot keeps birth year without retaining exact month/day.
- Store sex as a structured field: `female`, `male`, `intersex`, or `prefer_not_to_say`.
- Store ZIP only if needed for pilot reporting or coverage/cost context.
- Store email only as needed for authentication and user communication.

## Insurance card

- Insurance card upload may be used for working validation.
- Long-term pilot reporting should retain only coverage class while MVP privacy mode is enabled:
  - Commercial
  - Medicare
  - Medicaid
- The card image should not be retained long term in the MVP pilot.
- The schema still supports secure card file storage later, once the security model is ready.
- Insurance card records should be marked as validation-only unless a later production workflow requires secure file retention.

## Lab and imaging document upload

- Lab and imaging documents may be uploaded for MVP review.
- During MVP privacy mode, the file should be treated as temporary working input for OCR/LLM review.
- The original uploaded file should not be retained long term.
- Permanent storage should be limited to:
  - plain-English lab or imaging summary
  - overall picture
  - recommended next steps
  - generated care actions
  - avoidable-delay/cost-exposure reporting signals
  - confidence score
  - evidence score
  - rationale
  - file metadata such as name, type, and size
- The current MVP route stores the review result and metadata. Actual OCR/LLM extraction can be connected to the same route later without changing the patient-facing workflow.

## Visit audio and transcript

- Audio should not be permanently stored.
- Audio should be used only to create a transcript.
- Pause/resume should continue the same recording session.
- Stop recording should be the only user action that sends the visit audio to the backend for transcription.
- Transcript may be stored temporarily for QA with a 72-hour retention window.
- Permanent storage should be limited to:
  - plain-English summary
  - generated actions
  - generated documents
  - approval/sent history
  - confidence score
  - evidence score
  - rationale
  - QA review status and corrections
- MVP transcription can use Deepgram when `DEEPGRAM_API_KEY` is present. If transcription is unavailable, the app can fall back to a simulated transcript for demo continuity.

## Reportable metrics to retain

The MVP can still report on:

- avoidable care delays flagged
- open actions created/completed
- cost exposure clarified
- estimated dollar exposure
- caregiver updates sent
- advocacy requests completed
- visit summaries approved
- user approvals and action history

## Caregiver sharing

- Caregiver updates should require user approval before sending.
- Information sent to a caregiver should be shared by secure expiring link.
- The secure link should be tokenized and stored as a hash in the database.
- Link activity should be logged with created date, expiry date, viewed date, and revocation date if applicable.
