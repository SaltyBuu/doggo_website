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
  registerBtn.addEventListener('click', registerUser);
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
      'content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (res.status === 200) {
        res.json().then((json) => {
          console.log('Token: ', json.token);
          localStorage.accessToken = json.token;
          console.log('index.html');
          localStorage.user = login;
          window.location.href = 'index.html';
          localStorage.userid = json.userid; //TODO Temporaire
          //TODO enlever listener index.js
        });
      }
      if (res.status === 403) {
        res.json().then((json) => {
          console.log('No token', json.message);
        });
      }
    })
    .catch((e) => console.log(e));
}

async function hashPass(password) {
  //TODO salt+hash on server side and turn button type to submit type
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

async function registerUser() {
  const signDiv = document.querySelector('div.sign');
  const login = signDiv.getElementsByTagName('input')[0].value;
  const password = signDiv.getElementsByTagName('input')[1].value;
  const mail = signDiv.getElementsByTagName('input')[2].value;
  const hashed = await hashPass(password);

  console.log('Password:', password);
  console.log('Hashed:', hashed);
  let url = new URL(backend + '/users');
  const data = {
    login: login,
    password: hashed,
    mail: mail,
  };
  console.log('Body:', JSON.stringify(data));
  fetch(url, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (res.status === 201) {
        res.json().then(() => {
          url = new URL(backend + '/auth');
          fetch(url, {
            method: 'POST',
            headers: {
              'content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(data),
          })
            .then((res) => {
              if (res.status === 200) {
                res.json().then((json) => {
                  console.log('Token: ', json.token);
                  localStorage.accessToken = json.token;
                  console.log('index.html');
                  localStorage.user = login;
                  window.location.href = 'index.html';
                  localStorage.userid = json.id; //TODO Temporaire
                  //TODO enlever listener index.js
                });
              }
              if (res.status === 403) {
                res.json().then((json) => {
                  console.log('No token', json.message);
                });
              }
            })
            .catch((e) => console.log(e));
        });
      } else if (res.status === 400) {
        res.json().then((json) => console.log(json.message()));
      } else {
        console.log('Couldnt create user');
      }
    })
    .catch((error) => console.log(error));
}

//TODO send post request using encrypted password
//TODO Store received token in cookie
//TODO disclaimer valeur du mot de passe

window.addEventListener('load', startUp);
