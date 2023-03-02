window.addEventListener('load', startUp);

function startUp() {
  const speakers = document.querySelectorAll('div.speaker-bg');
  const menuIcon = document.querySelector('#menu-icon-bg > img');
  [...speakers].forEach((s) => s.addEventListener('click', toggleSpeakers));
  menuIcon.addEventListener('click', toggleSidebar);
  // let audio = new Audio("../music/bee-gees-stayin-alive.mp3"); //try catch
  const audio = new Audio('../music/bee-gees-stayin-alive.wav');
  audio.preload = 'auto';
  audio.volume = 0.1;
  audio.loop = true;
}
function toggleSpeakers() {
  const speakers = document.querySelectorAll('div.speaker-bg');
  const speakersArr = [...speakers];
  const audio = new Audio('../music/bee-gees-stayin-alive.wav');

  const pausedAttr =
    speakersArr[0].style.animationPlayState === 'running'
      ? 'paused'
      : 'running';
  if (pausedAttr === 'running') {
    // audio.currentTime = 0;
    console.log('Playing');
    audio.play();
  } else {
    audio.pause();
    audio.currentTime = 0;
  }
  speakersArr.forEach((s) => (s.style.animationPlayState = pausedAttr));
  void speakersArr[0].offsetWidth;
}

function toggleSidebar() {
  const menuIconDiv = document.getElementById('menu-icon-bg');
  const toggleMenuDiv = document.getElementById('toggle-menu');
  menuIconDiv.classList.toggle('pulled');
  toggleMenuDiv.classList.toggle('pulled');
  // toggleMenuDiv.style.display =
  //   toggleMenuDiv.style.display === 'none' ? '' : 'none';
  console.log('ou');
}
