window.addEventListener("load", startUp);

function startUp() {
  const speakers = document.querySelectorAll("div.speaker-bg");
  console.log("hello world");
  [...speakers].forEach((s) => s.addEventListener("click", toggleSpeakers));
}

function toggleSpeakers() {
  const speakers = document.querySelectorAll("div.speaker-bg");
  [...speakers].forEach(
    (s) =>
      (s.style.animationPlayState =
        s.style.animationPlayState === "" ? "paused" : "")
  );
}
