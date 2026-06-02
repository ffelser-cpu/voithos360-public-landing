# Milestone 6 - Caregivers

## Beta Scope

- Add a patient-facing Caregiver module using the same top module tile navigation as the rest of the beta.
- Display the named caregiver below the module header and let the user edit caregiver profile details.
- Store caregiver profile, sharing permissions, caregiver updates, caregiver tasks, approval history, and status changes in the backend.
- Require approval before any caregiver update is sent.
- Save sent caregiver updates into the document/action history used by Settings.
- Increment the caregiver updates sent measurable impact metric after approval.

## Caregiver Statuses

- Draft
- Ready for approval
- Sent
- Accepted
- Completed
- Declined

## Stored Data

- Caregiver first name, last name, preferred email, relationship, phone, and source.
- Permissions for visit summary, appointment reminders, medication/lab reminders, and insurance/billing updates.
- Approved/sent updates with title, message, status, sent date, and related visit/action/request ids.
- Caregiver tasks with notes, due dates, status, sent date, completed date, and related visit/action/request ids.
- Approval history for updates and tasks.
