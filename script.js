const signupForm = document.querySelector("#signup-form");
const formNote = document.querySelector("#form-note");
const demoVideo = document.querySelector(".video-placeholder video");
const videoShell = document.querySelector(".video-placeholder");
const earlyAccessFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfN_3lA3igeHEhc_Q6hZRMWOTEZc60BSdrBlmVTaTsw24qEBA/viewform?usp=publish-editor";

demoVideo?.addEventListener("canplay", () => {
  videoShell?.classList.add("has-video");
});

signupForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  window.open(earlyAccessFormUrl, "_blank", "noopener,noreferrer");

  if (formNote) {
    formNote.textContent = "Opening the Voithos360 early access form in a new tab.";
  }
});
