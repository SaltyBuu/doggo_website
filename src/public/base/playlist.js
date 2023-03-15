import { toggleMute } from "./lib.js";
import { toggleSidebar } from "./lib.js";
const backend = "localhost:3000";
const prisma = new PrismaClient()

funciton init() {
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
  init()
  refreshPlaylist()
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
  const playlistDiv = document.getElementById("div.list")
  const results = await prisma.playlistSong.findMany({
    where: {
      playlistId: playlistId
    }
  })
  if (results != null) {
    results.forEach((s) =>
    {
      console.log('add div');
    })
  }
}
function runSearch(e) {
  if (e.key === "Enter") {
    const endPoint = "/songs";
    const url = new URL(backend + endPoint);
    // fetch(url, { method: "GET" });
    console.log("Requête spotify :", url)
  }
}

window.addEventListener("load", startUp);
