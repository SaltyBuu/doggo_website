const { toggleMute } = require('./lib.js');
const { toggleSidebar } = require('./lib.js');
const has = require('has-keys');
const { getapiResults } = require('spotify-request-example.js');
const backend = 'localhost:3000';
const prisma = new PrismaClient();
const TOKEN = 'toreplace';
const PLAYLISTID = 1;

let currentResults = [];
let selectedIndex = 0;

function init() {
  const menuIcon = document.querySelector('#menu-icon-bg');
  const muteSpan = document.getElementById('mute');
  const signinBtn = document.getElementById('signinBtn');
  const searchInput = document.getElementById('search');
  const addBtn = document.getElementById('add');

  menuIcon.addEventListener('click', toggleSidebar);
  muteSpan.addEventListener('click', () => toggleMute(audio));
  signinBtn.addEventListener(
    'click',
    () => (window.location.href = 'signin.html')
  );
  searchInput.addEventListener('keypress', runSearch);
  searchInput.addEventListener('change', updateSelection);
  addBtn.addEventListener('click', submitSong);
}

function startUp() {
  init();
  refreshPlaylist();
  const audio = new Audio('../music/bee-gees-stayin-alive.wav');
  audio.preload = 'auto';
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
  const playlistDiv = document.getElementById('div.list');
  const newChildren = new Array();
  const results = await prisma.playlistSong.findMany({
    where: {
      playlistId: playlistId
    },
    include: {
      song: true
    },
    orderBy: {
      rank: 'asc'
    }
  });
  if (results != null) {
    results.forEach((s) => {
      const songObj = results['song'];
      const resultDiv = document
        .querySelector('div.model.song')
        .cloneNode(true);
      resultDiv.classList.toggle('model');
      const img = resultDiv.querySelector('img');
      img.alt = songObj['album'];
      resultDiv.querySelector('p.title').value = songObj['name'];
      resultDiv.querySelector('p.artist').value = songObj['artist'];
      resultDiv.querySelector('p.rank').value = songObj['rank'];
      newChildren.appendChild(resultDiv);
    });
    playlistDiv.replaceChildren(...newChildren);
  }
}

function submitSong() {
  const searchInput = document.getElementById('search');
  if ((searchInput.value === '') || (currentResults.length === 0)) return;
  addSong(PLAYLISTID,
    currentResults[selectedIndex].name,
    currentResults[selectedIndex].artist,
    currentResults[selectedIndex].album);
}

function updateSelection() {

}

async function addSong(playlistId, name, artist, album) {
  const playlistEndPoint = '/' + playlistId;
  let songEndpoint = '/songs';
  let url = new URL(backend + songEndpoint);
  const body = new URLSearchParams();
  body.append('name', name);
  body.append('album', album);
  body.append('artist', artist);
  await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'x-access-token': TOKEN
    },
    body
  })
    .then(function(res) {
      //If the song isn't in any playlist, add to songs
      if (res.status === 404) {
        res.json().then(
          async function() {
            await fetch(url, {
              method: 'PUT',
              headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'x-access-token': TOKEN
              },
              body
            });
          }
        )
          .catch((e) => (console.log(e.error())));
      }
      // If a song was found, check if in playlist
      else if (res.ok) {
        let songId = 0;
        res.json().then(
          async function(song) {
            let songId = parseInt(song.songId);
            let playlistSongEndpoint = playlistEndPoint + '/' + songId + '/';
            url = new URL(backend + playlistSongEndpoint);
            await fetch(url, {
              method: 'GET',
              headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'x-access-token': TOKEN
              },
              body
            });
          }
            .then(async function(song) {
              //If song is not in playlist, add it
              const body = new URLSearchParams();
              body.append('songId', songId.toString());
              if (res.status === 404) {
                url = new URL(backend + playlistEndPoint + songEndpoint);
                await fetch(url, {
                  method: 'PUT',
                  headers: {
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'x-access-token': TOKEN
                  },
                  body
                })
                  .catch((e) => (console.log(e.error())));
              }
            })
            .catch((e) => (console.log(e.error())))
        )
          .catch((e) => (console.log(e.error())));
      } else {
        console.log(res);
      }
    })
    .catch((e) => {
      console.log(e.error());
    });
}

function displayResults(results) {
  const datalist = document.getElementById('searchResults');
  const optNodes = [];
  const option = document.querySelector('option.model.result');
  results.forEach((r) => {
    const newOption = option.cloneNode();
    newOption.style.value = r.title + ', ' + r.artist;
    newOption.className = 'searchResult';
    optNodes.push(newOption);
  });
  datalist.replaceChildren(...optNodes);
}

function runSearch(e) {
  if (e.key === 'Enter') {
    this.disabled = true;
    const endPoint = '/songs';
    const url = new URL(backend + endPoint);
    // fetch(url, { method: "GET" });
    console.log('Requête spotify :', url); // => apiResults.json()
    apiResults = $.get('localhost:3000/spotify-request-example.json');
    const extractedResults = getapiResults();
    // Affichage résultats
    const results = extractedResults.tracks.items.map(s => ({
      artist: s.album.artists[0].name,
      album: s.album.name,
      title: s.name
    }));
    currentResults = results;
    displayResults(results);
  }
}

window.addEventListener('load', startUp);
