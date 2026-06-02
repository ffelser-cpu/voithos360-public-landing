const defaultCareTeam = {
  primary: {
    name: "Dr. Elisha Hammond",
    shortName: "Dr. Hammond",
    organization: "",
  },
  gi: {
    name: "Dr. Meredith Grey",
    shortName: "Dr. Grey",
    organization: "GI Associates of Seattle",
  },
  hematology: {
    name: "Dr. Miranda Bailey",
    shortName: "Dr. Bailey",
    organization: "Grey-Sloan Hematology",
  },
  patient: {
    name: "Jen Morgan",
    firstName: "Jen",
  },
  caregiver: {
    name: "Alicia Morgan",
    firstName: "Alicia",
  },
};

function normalize(value = "") {
  return String(value).toLowerCase();
}

function shortProviderName(name = "") {
  const trimmed = name.trim();

  if (!trimmed) {
    return "";
  }

  const parts = trimmed.split(/\s+/);
  const lastName = parts[parts.length - 1];

  if (/^dr\.?$/i.test(parts[0]) && lastName) {
    return `Dr. ${lastName}`;
  }

  return trimmed;
}

function providerMatches(provider = {}, pattern) {
  return pattern.test(normalize(`${provider.name || ""} ${provider.specialty || ""} ${provider.organization || ""} ${provider.role || ""}`));
}

function formatProvider(provider, fallback) {
  const name = provider?.name?.trim() || fallback.name;
  const organization = provider?.organization?.trim() || fallback.organization;

  return {
    name,
    shortName: shortProviderName(name) || fallback.shortName,
    organization,
    displayWithOrganization: organization ? `${name} at ${organization}` : name,
  };
}

export function buildProviderContext(providers = [], options = {}) {
  const usableProviders = providers.filter((provider) => provider?.name?.trim());
  const profile = options.profile || {};
  const primaryProviderName = profile.primaryProviderName?.trim();
  const savedPrimaryProvider = primaryProviderName
    ? usableProviders.find((provider) => provider.name === primaryProviderName)
    : null;

  const primaryProvider =
    savedPrimaryProvider ||
    usableProviders.find((provider) => providerMatches(provider, /(primary|pcp|family|internal|general)/)) ||
    usableProviders[0];
  const giProvider =
    usableProviders.find((provider) => providerMatches(provider, /(gi|gastro|hepat|liver)/)) ||
    usableProviders.find((provider) => provider.name !== primaryProvider?.name && providerMatches(provider, /(specialist|digestive)/));
  const hematologyProvider =
    usableProviders.find((provider) => providerMatches(provider, /(hemat|blood|anemia|oncolog)/)) ||
    usableProviders.find((provider) => provider.name !== primaryProvider?.name && provider.name !== giProvider?.name && providerMatches(provider, /(specialist)/));

  const patientName = [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim() || defaultCareTeam.patient.name;
  const caregiverName = profile.caregiverName?.trim() || defaultCareTeam.caregiver.name;

  return {
    primary: formatProvider(primaryProvider, defaultCareTeam.primary),
    gi: formatProvider(giProvider, defaultCareTeam.gi),
    hematology: formatProvider(hematologyProvider, defaultCareTeam.hematology),
    patient: {
      name: patientName,
      firstName: profile.firstName?.trim() || defaultCareTeam.patient.firstName,
    },
    caregiver: {
      name: caregiverName,
      firstName: caregiverName.split(/\s+/)[0] || defaultCareTeam.caregiver.firstName,
    },
  };
}

export function personalizeCareText(text = "", context = defaultCareTeam) {
  if (typeof text !== "string") {
    return text;
  }

  const replacements = [
    ["Dr. Elisha Hammond", context.primary.name],
    ["Dr. Hammond", context.primary.shortName],
    ["Dr. Meredith Grey at GI Associates of Seattle", context.gi.displayWithOrganization],
    ["Dr. Meredith Grey", context.gi.name],
    ["Dr. Grey", context.gi.shortName],
    ["GI Associates of Seattle", context.gi.organization],
    ["Dr. Miranda Bailey at Grey-Sloan Hematology", context.hematology.displayWithOrganization],
    ["Dr. Miranda Bailey", context.hematology.name],
    ["Dr. Bailey", context.hematology.shortName],
    ["Grey-Sloan Hematology", context.hematology.organization],
    ["Jen Morgan", context.patient.name],
    ["Jen's", `${context.patient.firstName}'s`],
    ["Jen ", `${context.patient.firstName} `],
    ["Alicia Morgan", context.caregiver.name],
    ["Alicia,", `${context.caregiver.firstName},`],
    ["Alicia's", `${context.caregiver.firstName}'s`],
  ].filter(([, replacement]) => replacement);

  return replacements.reduce((updatedText, [search, replacement]) => (
    updatedText.split(search).join(replacement)
  ), text);
}

export function personalizeCareContent(value, context) {
  if (typeof value === "string") {
    return personalizeCareText(value, context);
  }

  if (Array.isArray(value)) {
    return value.map((item) => personalizeCareContent(item, context));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, personalizeCareContent(item, context)]));
  }

  return value;
}
