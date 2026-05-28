const demoVideo = document.querySelector(".video-placeholder video");
const videoShell = document.querySelector(".video-placeholder");

demoVideo?.addEventListener("canplay", () => {
  videoShell?.classList.add("has-video");
});
