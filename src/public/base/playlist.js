import { toggleMute } from "./lib.js";
import { toggleSidebar } from "./lib.js";
const backend = "localhost:3000";
const prisma = new PrismaClient();
const TOKEN = "toreplace";

function init() {
  const menuIcon = document.querySelector("#menu-icon-bg");
  const muteSpan = document.getElementById("mute");
  const signinBtn = document.getElementById("signinBtn");
  const searchInput = document.getElementById("search");

  menuIcon.addEventListener("click", toggleSidebar);
  muteSpan.addEventListener("click", () => toggleMute(audio));
  signinBtn.addEventListener(
    "click",
    () => (window.location.href = "signin.html")
  );
  searchInput.addEventListener("keypress", runSearch);
}

function startUp() {
  init();
  refreshPlaylist();
  const audio = new Audio("../music/bee-gees-stayin-alive.wav");
  audio.preload = "auto";
  audio.volume = 0.1;
  audio.loop = true;

  //TODO ajouter une chanson si elle n'est pas déjà dans la playlist
  //TODO voter une chanson
  //TODO dévoter une chanson
  //TODO Afficher tout dans la playlist
  //TODO Chercher un nom, le résultat s'affiche et la chanson s'ajoute quand on clique
  //TODO Chercher via spotify (5 à chaque lettre)
}
async function refreshPlaylist(playlistId) {
  const playlistDiv = document.getElementById("div.list");
  const newChildren = new Array();
  const results = await prisma.playlistSong.findMany({
    where: {
      playlistId: playlistId,
    },
    include: {
      song: true,
    },
    orderBy: {
      rank: "asc",
    },
  });
  //TODO edit api to allow queries of all songs in a playlist
  if (results != null) {
    results.forEach((s) => {
      const songObj = results["song"];
      const resultDiv = document
        .querySelector("div.model.song")
        .cloneNode(true);
      resultDiv.classList.toggle("model");
      const img = resultDiv.querySelector("img");
      img.alt = songObj["album"];
      resultDiv.querySelector("p.title").value = songObj["name"];
      resultDiv.querySelector("p.artist").value = songObj["artist"];
      resultDiv.querySelector("p.rank").value = songObj["rank"];
      newChildren.appendChild(resultDiv);
    });
    playlistDiv.replaceChildren(...newChildren);
  }
}

async function addSong(playlistId, name, artist) {
  const endPoint = "/songs";
  const url = new URL(backend + endPoint);
  const body = new URLSearchParams();
  body.append("name", name);
  body.append("artist", artist);
  fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "x-access-token": TOKEN,
    },
    body,
  })
    .then((res) => res.json())
    .then((json) => {
      //TODO add song to playlist song
    });
  //TODO .catch add song to songs and playlist songs
}
function runSearch(e) {
  if (e.key === "Enter") {
    const endPoint = "/songs";
    const url = new URL(backend + endPoint);
    // fetch(url, { method: "GET" });
    console.log("Requête spotify :", url);
  }
}

window.addEventListener("load", startUp);
