import { cookies } from "next/headers";
import { smartCookieNames, decodeSession } from "./smart";

export function getSmartSession() {
  return decodeSession(cookies().get(smartCookieNames.session)?.value);
}

export function requireSmartSession() {
  const session = getSmartSession();

  if (!session?.accessToken || !session?.iss) {
    throw new Error("No active SMART session.");
  }

  return session;
}

export async function fhirFetch(session, pathOrUrl, searchParams) {
  const url = new URL(pathOrUrl.startsWith("http") ? pathOrUrl : `${session.iss.replace(/\/$/, "")}/${pathOrUrl.replace(/^\//, "")}`);

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, value);
      }
    });
  }

  const response = await fetch(url, {
    headers: {
      Accept: "application/fhir+json, application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`FHIR request failed ${response.status}: ${text.slice(0, 300)}`);
  }

  return response.json();
}

export function bundleEntries(bundle) {
  return bundle?.entry?.map((entry) => entry.resource).filter(Boolean) || [];
}

export async function getPatientDemographics(session) {
  return fhirFetch(session, `Patient/${session.patient}`);
}

export async function getAppointments(session) {
  const bundle = await fhirFetch(session, "Appointment", {
    patient: session.patient,
    _sort: "-date",
    _count: "20",
  });

  return bundleEntries(bundle);
}

export async function getLabResults(session) {
  const bundle = await fhirFetch(session, "Observation", {
    patient: session.patient,
    category: "laboratory",
    _sort: "-date",
    _count: "50",
  });

  return bundleEntries(bundle);
}

export async function getInsurance(session) {
  const bundle = await fhirFetch(session, "Coverage", {
    patient: session.patient,
    _count: "20",
  });

  return bundleEntries(bundle);
}

export async function getEncounterHistory(session) {
  const bundle = await fhirFetch(session, "Encounter", {
    patient: session.patient,
    _sort: "-date",
    _count: "30",
  });

  return bundleEntries(bundle);
}

export async function getClinicalNotes(session) {
  const bundle = await fhirFetch(session, "DocumentReference", {
    patient: session.patient,
    _sort: "-date",
    _count: "20",
  });

  return bundleEntries(bundle);
}

export function summarizePatient(patient) {
  return {
    id: patient.id,
    name: patient.name?.map((name) => [name.given?.join(" "), name.family].filter(Boolean).join(" ")).join(", "),
    gender: patient.gender,
    birthDate: patient.birthDate,
    telecom: patient.telecom,
    address: patient.address,
    identifiers: patient.identifier,
  };
}

export function summarizeAppointments(appointments) {
  return appointments.map((item) => ({
    id: item.id,
    status: item.status,
    type: item.appointmentType?.text || item.serviceType?.[0]?.text,
    start: item.start,
    end: item.end,
    description: item.description,
    participants: item.participant?.map((participant) => participant.actor?.display).filter(Boolean),
  }));
}

export function summarizeLabs(observations) {
  return observations.map((item) => ({
    id: item.id,
    status: item.status,
    name: item.code?.text || item.code?.coding?.[0]?.display,
    effectiveDateTime: item.effectiveDateTime,
    issued: item.issued,
    value: item.valueQuantity
      ? `${item.valueQuantity.value ?? ""} ${item.valueQuantity.unit ?? ""}`.trim()
      : item.valueString || item.valueCodeableConcept?.text,
    interpretation: item.interpretation?.map((value) => value.text || value.coding?.[0]?.display).filter(Boolean),
    referenceRange: item.referenceRange?.map((range) => range.text || `${range.low?.value ?? ""}-${range.high?.value ?? ""} ${range.high?.unit ?? ""}`.trim()),
  }));
}

export function summarizeCoverage(coverages) {
  return coverages.map((item) => ({
    id: item.id,
    status: item.status,
    type: item.type?.text || item.type?.coding?.[0]?.display,
    subscriberId: item.subscriberId,
    payor: item.payor?.map((payor) => payor.display).filter(Boolean),
    period: item.period,
    class: item.class,
  }));
}

export function summarizeEncounters(encounters) {
  return encounters.map((item) => ({
    id: item.id,
    status: item.status,
    class: item.class?.display || item.class?.code,
    type: item.type?.map((type) => type.text || type.coding?.[0]?.display).filter(Boolean),
    period: item.period,
    reason: item.reasonCode?.map((reason) => reason.text || reason.coding?.[0]?.display).filter(Boolean),
    serviceProvider: item.serviceProvider?.display,
  }));
}

export function summarizeNotes(notes) {
  return notes.map((item) => ({
    id: item.id,
    status: item.status,
    type: item.type?.text || item.type?.coding?.[0]?.display,
    category: item.category?.map((category) => category.text || category.coding?.[0]?.display).filter(Boolean),
    date: item.date,
    author: item.author?.map((author) => author.display).filter(Boolean),
    description: item.description,
    attachments: item.content?.map((content) => ({
      contentType: content.attachment?.contentType,
      title: content.attachment?.title,
      url: content.attachment?.url,
    })).filter((attachment) => attachment.url),
  }));
}
