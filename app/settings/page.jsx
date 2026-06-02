"use client";

import { useEffect, useRef, useState } from "react";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { clearDraft, readDraft, writeDraft } from "../../lib/draftStorage";

const emptyProvider = {
  name: "",
  specialty: "",
  organization: "",
  phone: "",
  email: "",
  source: "Patient added",
};

function formatDate(value) {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 10);
}

function fileToDataUrl(file) {
  if (!file) {
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function SettingsPage() {
  const { user } = useUser();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    ageYears: "",
    sex: "",
    zipCode: "",
    email: "",
    caregiverName: "",
    caregiverEmail: "",
    caregiverRelationship: "",
    primaryProviderName: "",
    coverageType: "",
    selfPay: false,
  });
  const [providers, setProviders] = useState([{ ...emptyProvider }]);
  const [insuranceCard, setInsuranceCard] = useState(null);
  const [currentInsuranceCards, setCurrentInsuranceCards] = useState([]);
  const [insuranceRole, setInsuranceRole] = useState("primary");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const skipNextDraftWrite = useRef(false);
  const draftKey = `voithos360:settings-draft:${user?.id || "anonymous"}`;

  useEffect(() => {
    if (!user) {
      return;
    }

    async function loadSettings() {
      const response = await fetch("/api/settings");

      if (!response.ok) {
        const draft = readDraft(draftKey);

        if (draft) {
          setProfile((current) => ({ ...current, ...(draft.profile || {}) }));
          setProviders(draft.providers?.length ? draft.providers : [{ ...emptyProvider }]);
          setInsuranceRole(draft.insuranceRole || "primary");
          setMessage("A saved draft was restored.");
        }

        setSettingsLoaded(true);
        return;
      }

      const payload = await response.json();
      const intake = payload?.settings?.intake;
      const loadedProviders = payload?.settings?.providers || [];
      const draft = readDraft(draftKey);
      const savedProfile = {
        firstName: intake?.firstName || "",
        lastName: intake?.lastName || "",
        dob: formatDate(intake?.dob),
        ageYears: intake?.ageYears || "",
        sex: intake?.sex || "",
        zipCode: intake?.zipCode || "",
        email: intake?.email || user?.primaryEmailAddress?.emailAddress || "",
        caregiverName: intake?.caregiverName || "",
        caregiverEmail: intake?.caregiverEmail || "",
        caregiverRelationship: intake?.caregiverRelationship || "",
        primaryProviderName: intake?.primaryProviderName || "",
        coverageType: intake?.coverageType || "",
        selfPay: intake?.selfPay === true,
      };
      const savedProviders = loadedProviders.length ? loadedProviders.map((provider) => ({
        name: provider.name || "",
        specialty: provider.specialty || "",
        organization: provider.organization || "",
        phone: provider.phone || "",
        email: provider.email || "",
        source: provider.source || provider.ehrSource || "Patient added",
      })) : [{ ...emptyProvider }];

      setProfile(draft?.profile ? { ...savedProfile, ...draft.profile } : savedProfile);
      setProviders(draft?.providers?.length ? draft.providers : savedProviders);
      setInsuranceRole(draft?.insuranceRole || "primary");
      setCurrentInsuranceCards(payload?.settings?.currentInsuranceCards || []);
      setSettingsLoaded(true);

      if (draft) {
        setMessage("A saved draft was restored.");
      }
    }

    loadSettings();
  }, [draftKey, user]);

  useEffect(() => {
    if (!settingsLoaded) {
      return;
    }

    if (skipNextDraftWrite.current) {
      skipNextDraftWrite.current = false;
      return;
    }

    writeDraft(draftKey, { profile, providers, insuranceRole });
  }, [draftKey, insuranceRole, profile, providers, settingsLoaded]);

  function updateProfile(fieldName, value) {
    setProfile((current) => ({ ...current, [fieldName]: value }));
  }

  function updateProvider(index, fieldName, value) {
    setProviders((current) => current.map((provider, providerIndex) => (
      providerIndex === index ? { ...provider, [fieldName]: value } : provider
    )));
  }

  function addProvider() {
    setProviders((current) => [...current, { ...emptyProvider }]);
  }

  function removeProvider(index) {
    setProviders((current) => current.filter((_, providerIndex) => providerIndex !== index));
  }

  async function saveSettings(event) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setMessage("");

    const storageUrl = await fileToDataUrl(insuranceCard);
    const response = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profile,
        providers,
        insuranceCard: insuranceCard
          ? {
              fileName: insuranceCard.name,
              fileType: insuranceCard.type,
              fileSize: insuranceCard.size,
              storageUrl,
              coverageRole: insuranceRole,
              coverageType: profile.coverageType,
              validationUseOnly: true,
              retainedAfterValidation: false,
            }
          : null,
      }),
    });

    setIsSaving(false);

    if (!response.ok) {
      setError("Please check the highlighted information and try again.");
      return;
    }

    const payload = await response.json();
    const savedIntake = payload?.settings?.intake;
    const savedProviders = payload?.settings?.providers || providers;
    skipNextDraftWrite.current = true;

    if (savedIntake) {
      setProfile((current) => ({
        ...current,
        primaryProviderName: savedIntake.primaryProviderName || "",
        caregiverRelationship: savedIntake.caregiverRelationship || current.caregiverRelationship,
      }));
    }

    setProviders(savedProviders.length ? savedProviders.map((provider) => ({
      id: provider.id,
      name: provider.name || "",
      specialty: provider.specialty || "",
      organization: provider.organization || "",
      phone: provider.phone || "",
      email: provider.email || "",
      source: provider.source || provider.ehrSource || "Patient added",
    })) : [{ ...emptyProvider }]);
    setCurrentInsuranceCards(payload?.settings?.currentInsuranceCards || currentInsuranceCards);
    setInsuranceCard(null);
    clearDraft(draftKey);
    setMessage("Your information has been updated.");
  }

  return (
    <main className="settings-shell">
      <SignedOut>
        <section className="settings-card">
          <p className="eyebrow">Secure access</p>
          <h1>Please sign in to update your information</h1>
          <p className="consent-note">Settings are connected to your Voithos360 account.</p>
          <SignInButton mode="modal">
            <button className="primary-action consent-submit">Sign in</button>
          </SignInButton>
        </section>
      </SignedOut>

      <SignedIn>
        <form className="settings-card" onSubmit={saveSettings}>
          <div className="consent-header">
            <div>
              <p className="eyebrow">Settings</p>
              <h1>Update your information</h1>
            </div>
          </div>

          <section className="settings-section">
            <div>
              <p className="eyebrow">Care profile</p>
              <h2>Your information</h2>
            </div>
            <div className="intake-grid">
              <label className="auth-field">First name<input value={profile.firstName} onChange={(event) => updateProfile("firstName", event.target.value)} required /></label>
              <label className="auth-field">Last name<input value={profile.lastName} onChange={(event) => updateProfile("lastName", event.target.value)} required /></label>
              <label className="auth-field">Age<input type="number" min="0" max="120" value={profile.ageYears} onChange={(event) => updateProfile("ageYears", event.target.value)} /></label>
              <label className="auth-field">Sex
                <select value={profile.sex} onChange={(event) => updateProfile("sex", event.target.value)}>
                  <option value="">Choose one</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="intersex">Intersex</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </label>
              <label className="auth-field">ZIP code<input value={profile.zipCode} onChange={(event) => updateProfile("zipCode", event.target.value)} inputMode="numeric" maxLength="5" required /></label>
              <label className="auth-field">Email<input type="email" value={profile.email} onChange={(event) => updateProfile("email", event.target.value)} required /></label>
              <label className="auth-field">Caregiver name <span className="optional-label">Optional</span><input value={profile.caregiverName} onChange={(event) => updateProfile("caregiverName", event.target.value)} /></label>
              <label className="auth-field">Caregiver email <span className="optional-label">Optional</span><input type="email" value={profile.caregiverEmail} onChange={(event) => updateProfile("caregiverEmail", event.target.value)} /></label>
              <label className="auth-field">Caregiver relationship <span className="optional-label">Optional</span><input value={profile.caregiverRelationship} onChange={(event) => updateProfile("caregiverRelationship", event.target.value)} /></label>
              <label className="auth-field">Primary provider <span className="optional-label">Optional</span><input value={profile.primaryProviderName} onChange={(event) => updateProfile("primaryProviderName", event.target.value)} /></label>
            </div>
          </section>

          <section className="settings-section">
            <div className="settings-section-header">
              <div>
                <p className="eyebrow">Provider list</p>
                <h2>Your providers</h2>
              </div>
              <button className="ghost-action" type="button" onClick={addProvider}>Add provider</button>
            </div>
            <div className="provider-editor-list">
              {providers.map((provider, index) => (
                <article className="provider-editor" key={provider.id || `provider-${index}`}>
                  <label className="auth-field">Provider name<input value={provider.name} onChange={(event) => updateProvider(index, "name", event.target.value)} /></label>
                  <label className="auth-field">Role or specialty<input value={provider.specialty} onChange={(event) => updateProvider(index, "specialty", event.target.value)} /></label>
                  <label className="auth-field">Organization<input value={provider.organization} onChange={(event) => updateProvider(index, "organization", event.target.value)} /></label>
                  <label className="auth-field">Phone number<input value={provider.phone} onChange={(event) => updateProvider(index, "phone", event.target.value)} /></label>
                  <label className="auth-field">Email<input type="email" value={provider.email} onChange={(event) => updateProvider(index, "email", event.target.value)} /></label>
                  <label className="auth-field">Source<input value={provider.source} onChange={(event) => updateProvider(index, "source", event.target.value)} /></label>
                  {providers.length > 1 ? <button className="tiny-button" type="button" onClick={() => removeProvider(index)}>Remove</button> : null}
                </article>
              ))}
            </div>
          </section>

          <section className="insurance-upload">
            <div>
              <p className="eyebrow">Insurance card</p>
              <h2>Upload a new insurance card</h2>
              <p>Choose whether the card is primary or secondary. For the MVP pilot, the card is used for validation and the long-term record stores only the coverage type.</p>
              {currentInsuranceCards.length ? (
                <div className="insurance-card-list">
                  {currentInsuranceCards.map((card) => (
                    <article className="saved-insurance-card" key={card.id || card.fileName}>
                      <p className="consent-note">Current {card.coverageRole || "primary"} card</p>
                      {card.storageUrl ? (
                        <a href={card.storageUrl} target="_blank" rel="noreferrer">
                          <img src={card.storageUrl} alt={`${card.coverageRole || "Primary"} insurance card`} />
                          <span>{card.fileName}</span>
                        </a>
                      ) : (
                        <p className="consent-note">{card.coverageType ? `Validated as ${card.coverageType}` : "Card image not retained after validation"}</p>
                      )}
                    </article>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="insurance-inputs">
              <label className="auth-field">Card type
                <select value={insuranceRole} onChange={(event) => setInsuranceRole(event.target.value)}>
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                </select>
              </label>
              <label className="auth-field">Coverage type
                <select value={profile.coverageType} onChange={(event) => updateProfile("coverageType", event.target.value)}>
                  <option value="">Choose coverage type</option>
                  <option value="commercial">Commercial</option>
                  <option value="medicare">Medicare</option>
                  <option value="medicaid">Medicaid</option>
                </select>
              </label>
              <label className="insurance-upload-target">
                <span>{insuranceCard ? `New card: ${insuranceCard.name}` : "Tap to upload a new card"}</span>
                <small>Optional | validation only</small>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(event) => setInsuranceCard(event.target.files?.[0] || null)}
                />
              </label>
              <label className="self-pay-choice settings-self-pay">
                <input type="checkbox" checked={profile.selfPay} onChange={(event) => updateProfile("selfPay", event.target.checked)} />
                <span>Self pay</span>
              </label>
            </div>
          </section>

          <p className="auth-error" role="alert">{error}</p>
          <p className="settings-message" role="status">{message}</p>
          <button className="primary-action consent-submit" type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </SignedIn>
    </main>
  );
}
