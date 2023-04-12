import { toggleMute, toggleSidebar } from './lib.js';
const TOKEN = 'toreplace';
const backend = 'http://localhost:3000';

function startUp() {
  const menuIcon = document.querySelector('#menu-icon-bg');
  const muteSpan = document.getElementById('mute');
  const audio = new Audio('../music/bee-gees-stayin-alive.wav');
  const signinBtn = document.getElementById('signin-btn');
  const registerBtn = document.getElementById('register-btn');

  menuIcon.addEventListener('click', toggleSidebar);
  muteSpan.addEventListener('click', () => toggleMute(audio));
  audio.preload = 'auto';
  audio.volume = 0.1;
  audio.loop = true;
  signinBtn.addEventListener(
    'click',
    // () => (window.location.href = 'playlist.html'
    sendCredentials
    // )
  );
  console.log('Listener added');
  registerBtn.addEventListener(
    'click',
    () => (window.location.href = 'signin.html')
  );
}

async function sendCredentials() {
  const signDiv = document.querySelector('div.sign');
  const login = signDiv.getElementsByTagName('input')[0].value;
  const password = signDiv.getElementsByTagName('input')[1].value;
  const mail = signDiv.getElementsByTagName('input')[2].value;
  const hashed = await hashPass(password);
  console.log('Password:', password);
  console.log('Hashed:', hashed);
  const url = new URL(backend + '/auth');
  const data = {
    login: login,
    password: hashed,
    mail: mail,
  };
  console.log('Body:', JSON.stringify(data));
  fetch(url, {
    method: 'POST',
    headers: {
      'x-access-token': TOKEN,
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json)
    .then((json) => {
      console.log(json);
      if (json.status === 200) {
        console.log('Token: ', json.token);
      }
      if (json.status === 403) {
        console.log('No token', json.message);
      }
    })
    .catch((e) => console.log(e));
}

async function hashPass(password) {
  console.log('hash start');
  const hashDigest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(password)
  );
  const hashArray = Array.from(new Uint8Array(hashDigest));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}
//TODO send post request using encrypted password
//TODO Store received token in cookie
//TODO disclaimer valeur du mot de passe

window.addEventListener('load', startUp);
