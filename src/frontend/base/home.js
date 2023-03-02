window.addEventListener("load", startUp);

function startUp() {
  const speakers = document.querySelectorAll("div.speaker-bg");
  [...speakers].forEach((s) => s.addEventListener("click", toggleSpeakers));
  // let audio = new Audio("../music/bee-gees-stayin-alive.mp3"); //try catch
  const audio = new Audio("../music/bee-gees-stayin-alive.mp3");
  audio.preload = "auto";
  audio.volume = 0.1;
  audio.loop = true;
  function toggleSpeakers() {
    const speakers = document.querySelectorAll("div.speaker-bg");
    const speakersArr = [...speakers];
    const pausedAttr =
      speakersArr[0].style.animationPlayState === "running"
        ? "paused"
        : "running";
    if (pausedAttr === "running") {
      // audio.currentTime = 0;
      console.log("Playing");
      audio.play();
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
    speakersArr.forEach((s) => (s.style.animationPlayState = pausedAttr));
    void speakersArr[0].offsetWidth;
  }
}
