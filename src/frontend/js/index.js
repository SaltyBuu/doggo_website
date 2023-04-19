let token = undefined;
function startUp() {
  const speakers = document.querySelectorAll('div.speaker-bg');
  const menuIcon = document.querySelector('#menu-icon-bg');
  const muteSpan = document.getElementById('mute');
  const audio = new Audio('../music/bee-gees-stayin-alive.wav');
  const signinBtn = document.getElementById('signin-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const voteBtn = document.getElementById('vote-btn');

  [...speakers].forEach((s) =>
    s.addEventListener('click', () => toggleSpeakers(audio))
  );
  menuIcon.addEventListener('click', toggleSidebar);
  muteSpan.addEventListener('click', () => toggleMute(audio));
  // let audio = new Audio("../music/bee-gees-stayin-alive.mp3"); //try catch
  audio.preload = 'auto';
  audio.volume = 0.1;
  audio.loop = true;
  signinBtn.addEventListener(
    'click',
    () => (window.location.href = 'signin.html')
  );
  logoutBtn.addEventListener('click', userLogOut);
  voteBtn.addEventListener(
    'click',
    () => (window.location.href = 'playlist.html')
  );

  console.log('Token:', localStorage.accessToken);
  if (localStorage.accessToken !== undefined) {
    //TODO valid token route + loading request
    signinBtn.classList.toggle('connected');
    signinBtn.value = localStorage.user;
    token = localStorage.accessToken;
    logoutBtn.classList.toggle('hidden');
  }
}
function toggleSpeakers(audio) {
  const speakers = document.querySelectorAll('div.speaker-bg');
  const speakersArr = [...speakers];
  // const audio = new Audio('../music/bee-gees-stayin-alive.wav');

  const pausedAttr =
    speakersArr[0].style.animationPlayState === 'running'
      ? 'paused'
      : 'running';
  if (pausedAttr === 'running') {
    // audio.currentTime = 0;
    // console.log('Playing');
    audio.play();
  } else {
    audio.pause();
    audio.currentTime = 0;
  }
  speakersArr.forEach((s) => (s.style.animationPlayState = pausedAttr));
  void speakersArr[0].offsetWidth;
}

function userLogOut() {
  localStorage.removeItem('user');
  localStorage.removeItem('accessToken');
  document.getElementById('logout-btn').classList.toggle('hidden');
  const signinBtn = document.getElementById('signin-btn');
  signinBtn.classList.toggle('connected');
  signinBtn.value = 'Se connecter';
}

function validToken(token) {
  //TODO disconnect + home on expired
}
window.addEventListener('load', startUp);
