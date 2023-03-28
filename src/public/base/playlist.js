const backend = 'http://localhost:3000';
const TOKEN = 'toreplace';
const PLAYLISTID = 1;
const USERID = 1;

let currentResults = [];
const audio = new Audio('../music/bee-gees-stayin-alive.wav');

const isInt = function (id) {
  return !isNaN(id) && parseInt(Number(id)) == id && !isNaN(parseInt(id, 10));
};

function init() {
  const menuIcon = document.querySelector('#menu-icon-bg');
  const muteSpan = document.getElementById('mute');
  const signinBtn = document.getElementById('signin-btn');
  const searchInput = document.getElementById('search');
  const addBtn = document.getElementById('add');

  menuIcon.addEventListener('click', toggleSidebar);
  muteSpan.addEventListener('click', () => toggleMute(audio));
  signinBtn.addEventListener(
    'click',
    () => (window.location.href = 'signin.html')
  );
  searchInput.addEventListener('keypress', runSearch);
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
  //TODO dévoter une chanson - supprimer si vote à 0
  //TODO Afficher tout dans la playlist
  //TODO Chercher un nom, le résultat s'affiche et la chanson s'ajoute quand on clique
  //TODO Chercher via spotify (5 à chaque lettre)
  //refresh without addinglistener
}

async function refreshPlaylist(playlistId) {
  console.log('REFRESHING');
  const endpoint = '/' + playlistId + '/songs';
  const url = new URL(backend + endpoint);
  await fetch(url, {
    method: 'GET',
    headers: {
      'x-access-token': TOKEN,
    },
  })
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      const newChildren = [];
      const results = json.results;
      if (results != null || results.length !== 0) {
        const playlistDiv = document.querySelector('div.list');
        results.forEach((r) => {
          console.log(r.song);
          const song = r.song;
          const resultDiv = document
            .querySelector('div.model.song')
            .cloneNode(true);
          resultDiv.classList.toggle('model');
          const img = resultDiv.querySelector('span.cover-container > img');
          img.src = song.thumbnail;
          img.alt = song.album;
          console.log('listener added');
          resultDiv
            .querySelector('span.title')
            .appendChild(document.createTextNode(song.name));
          // resultDiv.querySelector('span.artist').value = s['artist'];
          resultDiv
            .querySelector('span.artist')
            .appendChild(document.createTextNode(song.artist));
          // resultDiv.querySelector('span.votesNb').value = s['votesNb'];
          resultDiv
            .querySelector('span.votesNb')
            .appendChild(
              document.createTextNode(song.votesNb == null ? 0 : song.votesNb)
            );
          resultDiv.querySelector('span.vote > img').dataset.id =
            song.id.toString();
          newChildren.push(resultDiv);
        });
        playlistDiv.replaceChildren(...newChildren);
        [...playlistDiv.children].forEach((child) =>
          child
            .querySelector('span.vote > img')
            .addEventListener('click', addVote)
        );
      }
    })
    .catch((e) => console.log(e));
}

function addVote() {
  //TODO increment votesNb
  console.log('listener start');
  const songId = parseInt(this.dataset.id);
  console.log('this', this);
  const data = {
    userId: USERID,
    playlistId: PLAYLISTID,
    songId: songId,
  };
  console.log('Body addVote', JSON.stringify(data));
  const endpoint = '/votes';
  const url = new URL(backend + endpoint);
  const voted = fetch(url, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json; charset=UTF-8',
      'x-access-token': TOKEN,
    },
    body: JSON.stringify(data),
  });
  if (voted) {
    console.log('Vote: ', voted);
  } else {
    console.log('no vote: ', voted);
  }
  const voteSpan =
    this.parentElement.parentElement.querySelector('span.votesNb');
  voteSpan.value = voteSpan.value + 1;
}

async function submitSong() {
  const searchInput = document.getElementById('search');
  if (!searchInput.value || currentResults.length === 0) return;
  const option = document.querySelector(
    'option[value="' + searchInput.value + '"]'
  );
  if (!option) return;
  console.log(searchInput.value);
  await findOrAddSong(
    PLAYLISTID,
    option.dataset.name,
    option.dataset.artist,
    option.dataset.album,
    option.dataset.thumbnail
  );
}

async function findOrAddSong(playlistId, name, artist, album, thumbnail) {
  const songEndpoint = '/songs';
  const url = new URL(backend + songEndpoint);
  const data = {
    name: name,
    album: album,
    artist: artist,
    thumbnail: thumbnail,
  };
  const globalFound = await searchInSongs(data, url);
  console.log('1globalFound', globalFound);
  //If the song isn't in any playlist, add to songs and playlist
  if (globalFound.status === 404) {
    console.log('Song doesnt exist in any playlist !');
    const added = await addToSongs(data, url);
    console.log('added promise:', added);
    if (added.status === 201) {
      console.log('Song added to global songs !');
      await addToPlaylist(added, playlistId);
      // .catch((e)=>console.log(e))
    }
  } // If a song was found, check if in playlist
  else {
    const res = await globalFound.json();
    console.log('2globalFound: ', globalFound);
    console.log('Song already exists !');
    const localFound = await searchInPlaylist(res, playlistId);
    console.log('3globalFound: ', globalFound);
    console.log('LocalFound:', localFound);
    if (localFound.status === 404) {
      console.log('4globalFound: ', globalFound);
      console.log('Song isnt in current playlist');
      await addToPlaylist(res, playlistId);
    } else {
      console.log('Found', localFound);
      //TODO Scroll to song
    }
  }
  resetSearch();
}

async function addToPlaylist(promiseResult, playlistId) {
  const playlistEndPoint = '/' + playlistId;
  const songEndpoint = '/songs';
  console.log('Added: ', promiseResult);
  const songId = promiseResult.song.id;
  // if (isInt(song.id)) songId = parseInt(id);
  const body = JSON.stringify({
    songId: songId,
  });
  const url = new URL(backend + playlistEndPoint + songEndpoint);
  await fetch(url, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json; charset=UTF-8',
      'x-access-token': TOKEN,
    },
    body,
  }).catch((e) => console.log(e));
  await refreshPlaylist(PLAYLISTID);
}

async function searchInPlaylist(promiseResult, playlistId) {
  const playlistEndPoint = '/' + playlistId;
  const songId = promiseResult.song.id;
  // if (isInt(song.id)) songId = parseInt(id);
  const playlistSongEndpoint = playlistEndPoint + '/' + songId + '/';
  const url = new URL(backend + playlistSongEndpoint);
  return await fetch(url, {
    method: 'GET',
    headers: {
      'content-type': 'charset=UTF-8',
      'x-access-token': TOKEN,
    },
  });
}

async function searchInSongs(data, url) {
  const body = JSON.stringify(data);
  return await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json; charset=UTF-8',
      'x-access-token': TOKEN,
    },

    body,
  });
}

async function addToSongs(data, url) {
  const body = JSON.stringify(data);
  return await fetch(url, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json; charset=UTF-8',
      'x-access-token': TOKEN,
    },
    body,
  });
}

function resetSearch() {
  const searchInput = document.getElementById('search');
  searchInput.value = '';
}

function displayResults(results) {
  const datalist = document.getElementById('searchResults');
  const optNodes = [];
  const option = document.querySelector('option.model.result');
  results.forEach((r) => {
    const newOption = option.cloneNode();
    newOption.value = r.name + ', ' + r.artist;
    newOption.className = 'searchResult';
    newOption.dataset.album = r.album;
    newOption.dataset.name = r.name;
    newOption.dataset.artist = r.artist;
    newOption.dataset.thumbnail = r.thumbnail;
    optNodes.push(newOption);
  });
  datalist.replaceChildren(...optNodes);
}

function runSearch(e) {
  if (e.key === 'Enter' || this.value.length > 2) {
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
      name: s.name,
      thumbnail: s.album.images[s.album.images.length - 1].url, //Get smallest image url
    }));

    currentResults = results;
    displayResults(results);
  }
}

window.addEventListener('load', startUp);
