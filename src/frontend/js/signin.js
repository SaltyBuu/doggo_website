const backend = "https://api-doggo.herokuapp.com";

function startUp() {
  const menuIcon = document.querySelector("#menu-icon-bg");
  const muteSpan = document.getElementById("mute");
  const audio = new Audio("../music/bee-gees-stayin-alive.wav");
  const signinBtn = document.getElementById("signin-btn");
  const registerBtn = document.getElementById("register-btn");
  const preregisterBtn = document.getElementById("preregister-btn");

  menuIcon.addEventListener("click", toggleSidebar);
  muteSpan.addEventListener("click", () => toggleMute(audio));
  audio.preload = "auto";
  audio.volume = 0.1;
  audio.loop = true;
  signinBtn.addEventListener(
    "click",
    // () => (window.location.href = 'playlist.html'
    userLogin
    // )
  );
  console.log("Listener added");
  registerBtn.addEventListener("click", registerUser);
  preregisterBtn.addEventListener("click", enableRegister);
}

function enableRegister() {
  const inputCollection = document.getElementsByTagName("input");
  document.getElementsByTagName("label")[2].classList.toggle("hidden");
  document.getElementsByTagName("label")[3].classList.toggle("hidden");
  inputCollection[2].classList.toggle("hidden");
  inputCollection[3].classList.toggle("hidden");
  inputCollection[4].classList.toggle("hidden");
  inputCollection[5].classList.toggle("hidden");
  inputCollection[6].classList.toggle("hidden");
}

async function userLogin() {
  //TODO mauvais ogin message
  console.log("this", this);
  if (!checkSignForm()) return;
  const signDiv = document.querySelector("div.sign");
  const login = signDiv.getElementsByTagName("input")[0].value;
  const password = signDiv.getElementsByTagName("input")[1].value;
  const hashed = await hashPass(password);
  console.log("Password:", password);
  console.log("Hashed:", hashed);
  const data = {
    login: login,
    password: hashed,
  };
  sendCredentials(data);
}

function checkSignForm() {
  const signDiv = document.querySelector("div.sign");
  const inputs = signDiv.querySelectorAll(
    'input[type="text"]:not(.hidden),input[type="password"]:not(.hidden),input[type="email"]:not(.hidden)'
  );
  const nodes = [...inputs];
  let verified = true;
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].required = true;
    if (nodes[i].validity.valueMissing) {
      nodes[i].setCustomValidity("Field should not be empty.");
      verified = false;
      break;
    }
    if (nodes[i].validity.typeMismatch) {
      nodes[i].setCustomValidity("Email address expected.");
      verified = false;
      break;
    } else {
      nodes[i].setCustomValidity("");
    }
  }
  console.log("returned", verified);
  return verified;
}

function sendCredentials(data) {
  const url = new URL(backend + "/auth");
  fetchRequest(url, "POST", JSON.stringify(data))
    .then((res) => {
      if (res.status === 200) {
        res.json().then((json) => {
          console.log("Token: ", json.token);
          localStorage.accessToken = json.token;
          console.log("playlist.html");
          localStorage.user = data.login;
          window.location.href = "index.html";
          localStorage.userid = json.userid; //TODO Temporaire
          //TODO enlever listener index.js
        });
      }
      if (res.status === 403) {
        res.json().then((json) => {
          console.log("No token", json.message);
        });
      }
    })
    .catch((e) => console.log(e));
}

async function hashPass(password) {
  //TODO salt+hash on server side and turn button type to submit type
  console.log("hash start");
  const hashDigest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(password)
  );
  const hashArray = Array.from(new Uint8Array(hashDigest));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function registerUser() {
  if (!checkSignForm()) return;
  const signDiv = document.querySelector("div.sign");
  const login = signDiv.getElementsByTagName("input")[0].value;
  const password = signDiv.getElementsByTagName("input")[1].value;
  const mail = signDiv.getElementsByTagName("input")[2].value;
  const hashed = await hashPass(password);

  console.log("Password:", password);
  console.log("Hashed:", hashed);
  let url = new URL(backend + "/users");
  const data = {
    login: login,
    password: hashed,
    mail: mail,
  };
  console.log("Body:", JSON.stringify(data));
  fetchRequest(url, "PUT", JSON.stringify(data))
    .then((res) => {
      if (res.status === 201) {
        res.json().then(() => {
          url = new URL(backend + "/auth");
          sendCredentials(data);
        });
      } else if (res.status === 400) {
        res.json().then((json) => console.log(json.message()));
      } else {
        console.log("Couldnt create user"); // TODO handle error
      }
    })
    .catch((error) => console.log(error));
}

//TODO disclaimer valeur du mot de passe

window.addEventListener("load", startUp);
