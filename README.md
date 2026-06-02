# Voithos360 Next.js Prototype

Beta v1 scope is documented in:

```bash
docs/beta-v1-requirements.md
docs/milestone-1-auth-consent-intake.md
docs/milestone-2-overview.md
docs/open-actions-complexity-source.csv
docs/google-sheet-overview.csv
docs/google-sheet-ai-actions.csv
docs/google-sheet-denied-claim-risk.csv
docs/google-sheet-health-gaps.csv
docs/google-sheet-ai-action-automation-levels.csv
docs/google-sheet-lab-interpretation-engine.csv
docs/google-sheet-imaging-rules.csv
docs/appendix-c-lab-interpretation-engine.md
docs/appendix-d-imaging-interpretation-engine.md
```

Frontend stack:
- Next.js 14 App Router
- Tailwind CSS
- Clerk authentication

Backend stack:
- Node.js runtime through Next.js route handlers
- PostgreSQL via Prisma
- Vercel hosting

## One-Page Website

The public landing page lives at `/` in `app/page.jsx`.

Editable website copy lives in:

```bash
lib/siteContent.js
```

Update that file to change the landing headline, mission statement, founder bio, product mock descriptions, contact email, and sign-up copy.

For Vercel, import this project and set the Root Directory to:

```bash
voithos360-next
```

The page includes:

- Landing hero
- Mission statement
- Founder bio
- Product mocks
- Contact email
- Sign-up / early access form

## Local Setup

```bash
npm install
cp .env.example .env.local
npx prisma generate
npm run dev
```

## Database

Set `DATABASE_URL` to a PostgreSQL connection string. Then run:

```bash
npx prisma migrate dev --name init
```

The current UI still uses prototype patient data from `lib/patients.js`. The protected API routes are ready for the PostgreSQL-backed version:

- `GET /api/patients`
- `PATCH /api/care-actions`
- `GET /api/consents`
- `POST /api/consents`
- `GET /api/intake`
- `POST /api/intake`

`POST /api/consents` should be called once after account creation after the patient checks both required consent boxes. It stores the Clerk user ID, accepted consent versions, acceptance timestamp, IP address, and user agent in PostgreSQL.
`POST /api/intake` stores the completed onboarding questionnaire after consent. First name, last name, date of birth, ZIP code, and email are required; caregiver name is optional.

The beta schema also includes persistence models for:

- Provider profiles
- Insurance card uploads
- Advocacy requests
- Care action history
- ROI / measurable impact signals
- Visit copilot sessions
- Visit copilot suggested actions

## Clerk

Create a Clerk app, then add these environment variables in `.env.local` and Vercel:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/consent
```

In the Clerk dashboard, enable email/password authentication and set the password policy to:

- Minimum length: 8 characters
- Require at least 1 number
- Require at least 1 special character

## Oracle Health Cerner SMART on FHIR

Register a SMART app in Oracle Health Code Console and add the values to `.env.local` and Vercel.

Use these URLs after deployment:

```bash
SMART Launch URI=https://YOUR_VERCEL_DOMAIN.vercel.app/api/smart/launch
Redirect URI=https://YOUR_VERCEL_DOMAIN.vercel.app/api/smart/callback
```

Set these environment variables:

```bash
CERNER_CLIENT_ID=...
CERNER_CLIENT_SECRET=
CERNER_FHIR_BASE_URL=https://fhir-myrecord.cerner.com/r4/YOUR_SANDBOX_TENANT_ID
NEXT_PUBLIC_CERNER_FHIR_BASE_URL=https://fhir-myrecord.cerner.com/r4/YOUR_SANDBOX_TENANT_ID
SMART_REDIRECT_URI=https://YOUR_VERCEL_DOMAIN.vercel.app/api/smart/callback
CERNER_SMART_SCOPES="launch launch/patient openid fhirUser online_access patient/Patient.read patient/Appointment.read patient/Observation.read patient/Coverage.read patient/Encounter.read patient/DocumentReference.read patient/Binary.read"
```

The integration page is available at `/cerner`. After SMART authorization, `GET /api/fhir/summary` retrieves:

- Patient demographics from `Patient/{id}`
- Appointments from `Appointment?patient={id}`
- Lab results from `Observation?patient={id}&category=laboratory`
- Insurance from `Coverage?patient={id}`
- Encounter history from `Encounter?patient={id}`
- Clinical notes from `DocumentReference?patient={id}`

Clinical note attachments can be proxied through `GET /api/fhir/note?url=<DocumentReference attachment URL>`.

## Vercel

Create a Vercel project from this folder and add the same environment variables:

```bash
vercel
```
