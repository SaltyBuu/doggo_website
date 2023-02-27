window.addEventListener("load", startUp);

function startUp() {
  const speakers = document.querySelectorAll("div.speaker-bg");
  console.log("hello world");
  [...speakers].forEach((s) => s.addEventListener("click", toggleSpeakers));
}

function toggleSpeakers() {
  const speakers = document.querySelectorAll("div.speaker-bg");
  const speakersArr = [...speakers];
  const pausedAttr =
    speakersArr[0].style.animationPlayState === "running"
      ? "paused"
      : "running";
  speakersArr.forEach((s) => (s.style.animationPlayState = pausedAttr));
  console.log("oua");
}
