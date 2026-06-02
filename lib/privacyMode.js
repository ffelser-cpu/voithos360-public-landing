export function isMvpPrivacyMode() {
  return process.env.MVP_PRIVACY_MODE !== "false";
}

export function maskParticipantName(userId) {
  const participantCode = `VP-${userId.slice(-6).toUpperCase()}`;

  return {
    participantCode,
    firstName: "Pilot",
    lastName: participantCode,
  };
}
