# Appendix C: Lab Interpretation Engine

Source rules: `docs/google-sheet-lab-interpretation-engine.csv`

## Purpose

The lab interpretation engine reads structured lab data, normalizes it, identifies clinically meaningful changes, and creates a patient-facing plain-English summary plus any needed next action.

Patient-facing output appears in:

- "What happened recently" > "Clinical"
- "Next best actions" when follow-up is needed

Internal-only output is stored in the database but not displayed to the patient:

- Confidence score
- Evidence score
- Rationale
- Raw rule inputs
- Trend calculation details

## Ingestion Pipeline

The system should start from FHIR `Observation` resources when available.

Required flow:

1. Raw labs
2. Normalization
3. Clinical rules engine
4. Trend detection
5. Risk stratification
6. Recommendation generator
7. AI narrative summary

## Normalized Lab Fields

Every lab should normalize to:

| Field | Example |
| --- | --- |
| Patient ID | 123 |
| Test name | Hemoglobin A1c |
| LOINC code | 4548-4 |
| Value | 8.9 |
| Unit | % |
| Reference range | 4.0-5.6 |
| Abnormal flag | High |
| Collection date | 2026-03-01 |
| Trend delta | +0.8 |
| Source | Cerner |

## Core Lab Categories

| Category | Labs |
| --- | --- |
| Diabetes | A1c, glucose, microalbumin |
| Lipids | LDL, HDL, triglycerides |
| Renal | Creatinine, estimated glomerular filtration rate, blood urea nitrogen |
| Liver | AST, ALT, alkaline phosphatase |
| Hematology | Hemoglobin, white blood cell count, platelets |
| Thyroid | TSH, T4 |
| Electrolytes | Sodium, potassium |
| Preventive | Vitamin D, PSA |
| Oncology | Tumor markers |
| Cardiac | BNP, troponin |

## Example Rules

| Lab rule | Recommendation | Example patient-facing language |
| --- | --- | --- |
| A1c greater than 9 | Schedule primary care follow-up | Your blood sugar levels have increased since your last test. This may mean your diabetes is becoming harder to control. |
| LDL greater than 190 | Suggest medication discussion if not currently on therapy | Your cholesterol is high enough that it may be worth asking whether medication or a medication change would help lower your risk. |
| Low ferritin | Suggest discussion about iron studies | Your iron storage level looks low. It may be worth asking whether more iron testing or treatment is needed. |
| Abnormal TSH | Consider endocrinology consult | Your thyroid test is outside the expected range. Ask whether this needs repeat testing, medication adjustment, or specialist follow-up. |
| Rising creatinine | Consider nephrology consult | Your kidney number has changed in a way that may need follow-up. Ask whether this should be rechecked or reviewed by a kidney specialist. |
| Missing repeat labs | Remind patient | It looks like repeat blood work may be due. Voithos360 can help prepare the next step. |

## Trend Algorithm

For each user:

1. Pull all lab results by LOINC code and test category.
2. Normalize units and reference ranges.
3. Sort results chronologically.
4. Compare the current result to:
   - Prior result
   - 90-day average
   - 12-month baseline
   - Normal reference range
   - Clinical goal threshold

Calculate:

- Absolute change
- Percent change
- Rate of change
- Abnormality severity
- Persistence
- Volatility
- Clinical risk score

Assign one trend label:

- Improving
- Stable
- Worsening
- Newly abnormal
- Persistently abnormal
- Critical
- Insufficient data

## Trend Logic

| Situation | Trend label |
| --- | --- |
| Only one result is available | Insufficient data; do not discuss trend |
| Previous value normal and current value abnormal | Newly abnormal |
| Current value abnormal and previous value abnormal | Persistently abnormal |
| Direction is clinically better | Improving |
| Direction is clinically worse | Worsening |
| No meaningful change | Stable |

## Generated Outputs

The lab engine should generate:

- Plain-English summary
- Clinical interpretation
- Recommended next action
- Urgency level
- Confidence score
- Evidence score
- Rationale

Only the summary, plain-English meaning, and recommended next action are shown to the patient.
