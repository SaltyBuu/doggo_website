function startUp() {
  const menuIcon = document.querySelector('#menu-icon-bg');
  const audio = new Audio('../music/bee-gees-stayin-alive.wav');
  const signinBtn = document.getElementById('signin-btn');
  const registerBtn = document.getElementById('register-btn');
  const preregisterBtn = document.getElementById('preregister-btn');

  menuIcon.addEventListener('click', toggleSidebar);
  audio.preload = 'auto';
  audio.volume = 0.1;
  audio.loop = true;
  signinBtn.addEventListener('click', userLogin);
  registerBtn.addEventListener('click', userRegister);
  preregisterBtn.addEventListener('click', enableRegister);
  document.querySelectorAll('div.sign > input:not([type="button"])').forEach((e) =>
    e.addEventListener('keydown', async function (e) {
      if (e.key === 'Enter') {
        if (registerBtn.classList.contains('hidden')) userLogin();
        else userRegister();
      }
    })
  );
}

function enableRegister() {
  const inputCollection = document.getElementsByTagName('input');
  document.getElementsByTagName('label')[2].classList.toggle('hidden');
  document.getElementsByTagName('label')[3].classList.toggle('hidden');
  inputCollection[2].classList.toggle('hidden');
  inputCollection[3].classList.toggle('hidden');
  inputCollection[4].classList.toggle('hidden');
  inputCollection[5].classList.toggle('hidden');
  inputCollection[6].classList.toggle('hidden');
}

async function userLogin() {
  //TODO mauvais login message ou compte inconnu
  if (!checkSignForm()) return;
  const signDiv = document.querySelector('div.sign');
  const login = signDiv.getElementsByTagName('input')[0].value;
  const password = signDiv.getElementsByTagName('input')[1].value;
  const hashed = await hashPass(password);
  const data = {
    login: login,
    password: hashed,
  };
  sendCredentials(data);
}

function checkSignForm() {
  const signDiv = document.querySelector('div.sign');
  const inputs = signDiv.querySelectorAll(
    'input[type="text"]:not(.hidden),input[type="password"]:not(.hidden),input[type="email"]:not(.hidden)'
  );
  const nodes = [...inputs];
  let verified = true;
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].required = true;
    if (nodes[i].validity.valueMissing) {
      nodes[i].setCustomValidity('Field should not be empty.');
      nodes[i].reportValidity();
      verified = false;
      break;
    }
    if (nodes[i].validity.typeMismatch) {
      nodes[i].setCustomValidity('Email address expected.');
      nodes[i].reportValidity();
      verified = false;
      break;
    } else {
      nodes[i].setCustomValidity('');
      nodes[i].reportValidity();
    }
  }
  return verified;
}

function sendCredentials(data) {
  const url = new URL(backend + '/auth');
  fetchRequest(url, 'POST', JSON.stringify(data))
    .then((res) => {
      if (res.status === 200) {
        res.json().then((json) => {
          localStorage.accessToken = json.token;
          localStorage.user = data.login;
          window.location.href = 'index.html';
          localStorage.userid = json.userid; //TODO Temporaire
          //TODO enlever listener index.js
        });
      }
      if (res.status === 403) {
        res.json().then(() => {
          const passwordInput = document.querySelector('div.sign > input[name="password"]');
          passwordInput.setCustomValidity('');
          passwordInput.checkValidity();
          passwordInput.setCustomValidity('Invalid login or password.');
          passwordInput.reportValidity();
        });
      }
    })
    .catch((e) => console.log(e));
}

async function hashPass(password) {
  //TODO salt+hash on server side and turn button type to submit type
  const hashDigest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
  const hashArray = Array.from(new Uint8Array(hashDigest));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function userRegister() {
  if (!checkSignForm()) return;
  const signDiv = document.querySelector('div.sign');
  const login = signDiv.getElementsByTagName('input')[0].value.toLowerCase();
  const password = signDiv.getElementsByTagName('input')[1].value;
  const mail = signDiv.getElementsByTagName('input')[3].value;
  const hashed = await hashPass(password);

  let url = new URL(backend + '/users');
  const data = {
    login: login,
    password: hashed,
    mail: mail,
  };
  fetchRequest(url, 'PUT', JSON.stringify(data))
    .then((res) => {
      if (res.status === 201) {
        res.json().then(() => {
          url = new URL(backend + '/auth');
          sendCredentials(data);
        });
      } else if (res.status === 400) {
        res.json().then((json) => console.log(json.message));
        alert('User ' + login + ' already exists');
      }
    })
    .catch((error) => console.log(error));
}

//TODO disclaimer valeur du mot de passe

window.addEventListener('load', startUp);
