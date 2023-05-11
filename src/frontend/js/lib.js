// const backend = 'https://api-doggo.herokuapp.com';
const backend = 'http://localhost:3000';

function toggleSidebar() {
  // const menuIconDiv = document.getElementById('menu-icon-bg');
  const toggleMenuDiv = document.getElementById('toggle-menu');
  this.classList.toggle('pulled');
  toggleMenuDiv.classList.toggle('pulled');
  // toggleMenuDiv.style.display =
  //   toggleMenuDiv.style.display === 'none' ? '' : 'none';
  console.log('ou');
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
    // audio.currentTime = 0;
  }
  speakersArr.forEach((s) => (s.style.animationPlayState = pausedAttr));
  void speakersArr[0].offsetWidth;
}

function toggleMute(audio) {
  audio.muted = audio.muted !== true;
  document.querySelector('.mute-icon').classList.toggle('hidden');
  document.querySelector('.soundon-icon').classList.toggle('hidden');
}

function fetchRequest(url, method, body, token) {
  return fetch(url, {
    method: method,
    headers: {
      'content-type': 'application/json; charset=UTF-8',
      'x-access-token': token,
    },
    body: body,
  });
}

function userLogOut() {
  localStorage.removeItem('user');
  localStorage.removeItem('accessToken');
  const signinBtn = document.getElementById('signin-btn');
  signinBtn.classList.toggle('connected');
  signinBtn.value = 'Se connecter';
  signinBtn.removeEventListener('click', userLogOut);
  signinBtn.addEventListener('click', goToSignPage);
  window.location.href = 'index.html';
}

function goToSignPage() {
  window.location.href = 'signin.html';
}

async function validToken(t) {
  if (localStorage.userid === undefined) return false;
  const endpoint = '/users/' + parseInt(localStorage.userid);
  const url = new URL(backend + endpoint);
  const user = await fetchRequest(url, 'GET', null, t);
  console.log('User token response', user);
  return user.status === 200;
}

async function getConnectionStatus() {
  const signinBtn = document.getElementById('signin-btn');

  if (await validToken(localStorage.accessToken)) {
    //TODO valid token route + loading request
    signinBtn.classList.toggle('connected');
    signinBtn.value = localStorage.user;
    signinBtn.addEventListener('click', userLogOut);
    signinBtn.setAttribute('title', 'Se déconnecter');
    console.log('Token updated');
    token = localStorage.accessToken;
    userid = parseInt(localStorage.userid);
  } else {
    signinBtn.addEventListener('click', goToSignPage);
  }
}
