# Milestone 5: Advocacy Module

Source: Milestone 5 actions tab in the Voithos360 milestone Google Sheet.

## Scope

- Add an Advocacy module that keeps the existing prototype look and feel.
- Allow the user to create a care advocacy request.
- Show request status as the request moves through the workflow.
- Store advocacy requests in the backend database.

## Request Form

The Advocacy page should mirror the prototype language and include:

- Request type dropdown
- Urgency dropdown
- Free text box to briefly describe the issue
- Optional context fields for who is involved, related date, contact preference, and supporting document/photo

## Request Types

- Insurance issue
- Scheduling or referral
- Insurance or billing
- Claim denial
- Prior authorization
- Cost question
- Care coordination issue
- Prepare for an upcoming visit
- Something else

## Urgency Options

- Today or tomorrow
- This week
- Before my next appointment
- Not urgent, but I need help

## Statuses

- New
- In progress
- Waiting on provider
- Waiting on payer
- Resolved

## Backend Storage

Each request should store:

- User id
- Request type
- Description
- Urgency
- Status
- Voithos360 response
- Completion date
- Internal metadata, including hidden tags and reporting fields
- Created and updated timestamps
- Action history event for reporting

## Patient-Facing Display

- After submission, Voithos360 should answer the request to the best of its beta knowledge.
- The request should appear under request status as complete.
- Internal tags, urgency, hidden status values, and completion metadata should not be displayed to the user.
