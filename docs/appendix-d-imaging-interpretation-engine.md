# Appendix D: Imaging Interpretation Engine

Source rules: `docs/google-sheet-imaging-rules.csv`

## Purpose

The imaging interpretation engine reads radiology report text, extracts the clinically important pieces, classifies the finding, and creates a plain-English summary plus any needed next action.

Patient-facing output appears in:

- "What happened recently" > "Clinical"
- "Next best actions" when follow-up is needed

Internal-only output is stored in the database but not displayed to the patient:

- Confidence score
- Evidence score
- Rationale
- Extracted report fields
- Classification and urgency logic

## Required Extraction

- Modality: CT, MRI, X-ray, ultrasound
- Body region
- Exam date
- Indication
- Impression section
- Findings section
- Prior comparison, if any

## Key Finding Extraction

- Anatomy
- Abnormality
- Size
- Laterality
- Severity
- Acute versus chronic
- Incidental versus expected
- Comparison to prior

## Finding Classification

- Normal/no acute findings
- Acute actionable finding
- Chronic/stable finding
- Incidental finding
- Follow-up recommended

## Trend Determination

- New
- Improved
- Stable
- Worsened
- Resolved
- No prior comparison

## Urgency Assignment

- Routine
- Follow-up needed
- Time-sensitive
- Urgent/emergent

## Imaging Rule Categories

| Category | Examples | Voithos360 summary and action |
| --- | --- | --- |
| Normal | No acute abnormality | Reassure the user in plain English and do not create a follow-up action unless the report recommends one. |
| Acute | Fracture, pneumonia | Explain the finding in plain English and recommend calling the provider. Create a next best action when follow-up is needed. |
| Chronic | Degenerative changes | Explain that this appears long-standing or stable. Recommend follow-up if symptoms worsen or if the report asks for follow-up. |
| Incidental | Liver lesion | Explain that the finding may not be related to the reason for the scan, then create a follow-up action if provider review or repeat imaging is recommended. |

## Generated Outputs

The imaging engine should generate:

- Plain-English report summary
- Important finding category
- Trend
- Urgency level
- Recommended next action
- Confidence score
- Evidence score
- Rationale

Only the summary, plain-English meaning, and recommended next action are shown to the patient.
