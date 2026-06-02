# Beta Milestone 1: Auth, Consent, and Intake

## Goal

Create the first real onboarding path for patient beta users:

Create account or log in -> consent -> intake questionnaire.

## Login and Account Creation

- The login page should match Voithos360 branding and the current prototype style.
- The user signs in with email and password.
- The user can create an account from the same auth experience.
- Password policy:
  - At least 8 characters
  - At least 1 number
  - At least 1 special character
- Email verification should happen during account creation only.
- Verification method: PIN/code sent to the user's email.

## Login Error Handling

- If email or password is incorrect, tell the user to retry.
- Allow 4 login attempts total.
- After 4 failed attempts, tell the user to enter their email.
- If an account exists for that email, send a password reset email.
- Do not reveal whether an email address belongs to an account.

## Password Reset

- If the account exists, the user receives a password reset email.
- The reset flow asks the user to create a new password.
- The new password must meet the same password requirements.
- The user must enter the new password twice.

## Backend Storage

- Use Clerk/Auth provider for password handling.
- The Voithos360 database must not store raw passwords.
- The auth provider stores credentials securely.
- The Voithos360 backend stores:
  - Auth user ID reference
  - Email/profile data needed by the app
  - Consent records
  - Intake records
  - Onboarding completion state

## Consent Flow

- After account creation, the consent page appears.
- The consent page includes:
  - General data rights and usage consent
  - HIPAA authorization consent
- Both consents are required checkboxes.
- The "Continue to Voithos360" button is disabled until both boxes are checked.
- When the user clicks "Continue to Voithos360," store both consent records in the backend.
- After successful consent storage, send the user to intake.

## Intake Flow

- Intake appears after required consents are saved.
- Intake should collect the beta intake profile fields.
- Intake should match the Voithos360 prototype branding and visual style.
- Intake fields:
  - First name, required
  - Last name, required
  - Date of birth, required
  - ZIP code, required
  - Email, pre-populated from login
  - Caregiver name, optional
  - Provider name, optional
  - Insurance card photo upload, optional
  - Self pay checkbox, optional
- If a required field is missing, surface a clear notification and highlight the missing field.
- Insurance card upload should support taking a photo from the phone camera.
- Insurance upload is not required because the patient may be self-pay.
- The self-pay checkbox text should be: "Self pay".
- On "Complete intake," store the information and send the user to the overview page.
- Intake should appear only once during account creation/onboarding.
- Later profile edits should happen from Settings, not by repeating onboarding.

## Settings Flow

- Settings is part of Milestone 1.
- Settings should live in the hamburger menu.
- Settings contains an "Update your information" page.
- The page should match the Voithos360 prototype branding and visual style.
- First name, last name, date of birth, email, ZIP code, and caregiver name should be pre-populated from the patient's original intake.
- Patients can edit and save their profile information.
- The provider list can include:
  - Patient-entered providers
  - Providers extracted from the EHR API once connected
- Provider fields should be editable:
  - Provider name
  - Role or specialty
  - Organization
  - Phone number
  - Email
  - Source
- Provider data should be stored in the database.
- Patients can upload a new insurance card if needed.
- The insurance upload section should state: "Uploading a new card will override any insurance information previously gathered. The new card will be stored as current."
- A newly uploaded insurance card should be stored in the database and designated as current.
- Previous insurance card records should no longer be marked current.

## Clerk Configuration Required

Configure these in the Clerk dashboard:

- Email/password authentication enabled
- Email verification code required for new account creation
- Password minimum length: 8
- Password requires at least 1 number
- Password requires at least 1 special character
- Password reset enabled
- Production rate limiting/lockout configured to support the 4-attempt requirement where available

## Implementation Notes

- Clerk-hosted components can handle sign-in, sign-up, email verification, and password reset.
- A custom auth flow may be needed later if exact 4-attempt lockout behavior cannot be configured in Clerk.
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` should point to `/consent`.
- Returning users should not be shown consent and intake again once those records exist.
