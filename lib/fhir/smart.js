import crypto from "node:crypto";

export const smartCookieNames = {
  state: "voithos_smart_state",
  verifier: "voithos_smart_verifier",
  session: "voithos_smart_session",
};

export const defaultCernerScopes = [
  "launch",
  "launch/patient",
  "openid",
  "fhirUser",
  "online_access",
  "patient/Patient.read",
  "patient/Appointment.read",
  "patient/Observation.read",
  "patient/Coverage.read",
  "patient/Encounter.read",
  "patient/DocumentReference.read",
  "patient/Binary.read",
].join(" ");

export function base64Url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

export function randomBase64Url(byteLength = 32) {
  return base64Url(crypto.randomBytes(byteLength));
}

export function pkceChallenge(verifier) {
  return base64Url(crypto.createHash("sha256").update(verifier).digest());
}

export function getRedirectUri(request) {
  return process.env.SMART_REDIRECT_URI || new URL("/api/smart/callback", request.url).toString();
}

export function getClientId() {
  return process.env.CERNER_CLIENT_ID || process.env.SMART_CLIENT_ID;
}

export function getClientSecret() {
  return process.env.CERNER_CLIENT_SECRET || process.env.SMART_CLIENT_SECRET;
}

export function getScopes() {
  return process.env.CERNER_SMART_SCOPES || process.env.SMART_SCOPES || defaultCernerScopes;
}

export async function discoverSmartConfiguration(iss) {
  const base = iss.replace(/\/$/, "");
  const wellKnownUrl = `${base}/.well-known/smart-configuration`;
  const wellKnown = await fetch(wellKnownUrl, { headers: { Accept: "application/json" } });

  if (wellKnown.ok) {
    return wellKnown.json();
  }

  const capability = await fetch(`${base}/metadata`, { headers: { Accept: "application/fhir+json" } });

  if (!capability.ok) {
    throw new Error(`Unable to discover SMART configuration for ${iss}`);
  }

  const metadata = await capability.json();
  const security = metadata?.rest?.[0]?.security?.extension || [];
  const oauthUris = security.find((item) => item.url?.includes("oauth-uris"))?.extension || [];
  const authorizationEndpoint = oauthUris.find((item) => item.url === "authorize")?.valueUri;
  const tokenEndpoint = oauthUris.find((item) => item.url === "token")?.valueUri;

  if (!authorizationEndpoint || !tokenEndpoint) {
    throw new Error("FHIR metadata did not include SMART authorization and token endpoints.");
  }

  return {
    authorization_endpoint: authorizationEndpoint,
    token_endpoint: tokenEndpoint,
    capabilities: metadata,
  };
}

export function encodeSession(session) {
  return Buffer.from(JSON.stringify(session)).toString("base64url");
}

export function decodeSession(value) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}
