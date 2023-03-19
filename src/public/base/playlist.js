const backend = 'http://localhost:3000';
const TOKEN = 'toreplace';
const PLAYLISTID = 10;

let currentResults = [];
let selectedIndex = 0;
const audio = new Audio('../music/bee-gees-stayin-alive.wav');

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
  refreshPlaylist(PLAYLISTID);
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
  const endpoint = '/' + playlistId + '/songs';
  const url = new URL(backend + endpoint);
  console.log(url);
  await fetch(url, {
    method: 'GET',
    headers: {
      'x-access-token': TOKEN,
    },
  })
    .then((res) => res.json())
    .then((json) => {
      const newChildren = [];
      const results = json.results;
      if (results != null || results.length !== 0) {
        const playlistDiv = document.querySelector('div.list');
        results.forEach((s) => {
          console.log(s);
          const resultDiv = document
            .querySelector('div.model.song')
            .cloneNode(true);
          resultDiv.classList.toggle('model');
          const img = resultDiv.querySelector('img');
          // img.alt = s['album'];
          img.alt = 'alt';
          // resultDiv.querySelector('p.title').value = s['name'];
          resultDiv
            .querySelector('p.title')
            .appendChild(document.createTextNode('name'));
          // resultDiv.querySelector('p.artist').value = s['artist'];
          resultDiv
            .querySelector('p.artist')
            .appendChild(document.createTextNode('artist'));
          // resultDiv.querySelector('p.rank').value = s['rank'];
          resultDiv
            .querySelector('p.rank')
            .appendChild(document.createTextNode('3'));
          newChildren.push(resultDiv);
        });
        playlistDiv.replaceChildren(...newChildren);
      }
    })
    .catch((e) => console.log(e));
}

function submitSong() {
  const searchInput = document.getElementById('search');
  if (searchInput.value === '' || currentResults.length === 0) return;
  addSong(
    PLAYLISTID,
    currentResults[selectedIndex].name,
    currentResults[selectedIndex].artist,
    currentResults[selectedIndex].album
  );
}

function updateSelection() {}

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
      'x-access-token': TOKEN,
    },
    body,
  })
    .then(function (res) {
      //If the song isn't in any playlist, add to songs
      if (res.status === 404) {
        res
          .json()
          .then(async function () {
            await fetch(url, {
              method: 'PUT',
              headers: {
                'content-type':
                  'application/x-www-form-urlencoded; charset=UTF-8',
                'x-access-token': TOKEN,
              },
              body,
            });
          })
          .catch((e) => console.log(e));
      }
      // If a song was found, check if in playlist
      else if (res.ok) {
        let songId = 0;
        res
          .json()
          .then(
            async function (song) {
              let songId = parseInt(song.songId);
              let playlistSongEndpoint = playlistEndPoint + '/' + songId + '/';
              url = new URL(backend + playlistSongEndpoint);
              await fetch(url, {
                method: 'GET',
                headers: {
                  'content-type':
                    'application/x-www-form-urlencoded; charset=UTF-8',
                  'x-access-token': TOKEN,
                },
                body,
              });
            }
              .then(async function () {
                //If song is not in playlist, add it
                const body = new URLSearchParams();
                body.append('songId', songId.toString());
                if (res.status === 404) {
                  url = new URL(backend + playlistEndPoint + songEndpoint);
                  await fetch(url, {
                    method: 'PUT',
                    headers: {
                      'content-type':
                        'application/x-www-form-urlencoded; charset=UTF-8',
                      'x-access-token': TOKEN,
                    },
                    body,
                  }).catch((e) => console.log(e));
                }
              })
              .catch((e) => console.log(e))
          )
          .catch((e) => console.log(e));
      } else {
        console.log(res);
      }
    })
    .catch((e) => {
      console.log(e);
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
    this.style.disabled = true;
    const endPoint = '/songs';
    const url = new URL(backend + endPoint);
    // fetch(url, { method: "GET" });
    console.log('Requête spotify :', url); // => apiResults.json()
    const extractedResults = apiResults;
    console.log(extractedResults);
    // Affichage résultats
    const results = extractedResults.tracks.items.map((s) => ({
      artist: s.album.artists[0].name,
      album: s.album.name,
      title: s.name,
      image: s.album.images[s.album.images.length - 1].url, //Get smallest image url
    }));

    currentResults = results;
    displayResults(results);
  }
}

window.addEventListener('load', startUp);
