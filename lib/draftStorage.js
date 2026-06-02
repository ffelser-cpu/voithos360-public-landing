export function readDraft(key, fallback = null) {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const storedValue = window.localStorage.getItem(key);

    if (!storedValue) {
      return fallback;
    }

    return JSON.parse(storedValue)?.data ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeDraft(key, data) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify({
      data,
      updatedAt: new Date().toISOString(),
    }));
  } catch {
    // Draft saving should never block the user from continuing.
  }
}

export function clearDraft(key) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore local storage failures.
  }
}
