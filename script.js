const signupForm = document.querySelector("#signup-form");
const formNote = document.querySelector("#form-note");
const demoVideo = document.querySelector(".video-placeholder video");
const videoShell = document.querySelector(".video-placeholder");

demoVideo?.addEventListener("canplay", () => {
  videoShell?.classList.add("has-video");
});

signupForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(signupForm);
  const name = formData.get("name") || "";
  const email = formData.get("email") || "";
  const interest = formData.get("interest") || "";
  const note = formData.get("note") || "";
  const subject = encodeURIComponent("Voithos360 early access interest");
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nInterest: ${interest}\n\nNote:\n${note}`,
  );

  window.location.href = `mailto:hello@voithos360.com?subject=${subject}&body=${body}`;

  if (formNote) {
    formNote.textContent = "Opening an email draft with this information. Send that email to complete the request.";
  }
});
