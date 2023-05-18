const PLAYLISTID = 1;
let searchResults = [];
let token = undefined;
let userid = undefined;
let playlistData = [];
let currentIndex = 0;
let batchSize = 5;

function init() {
  // DOM queries
  const menuIcon = document.querySelector('#menu-icon-bg');
  const searchInput = document.getElementById('search');
  const addBtn = document.getElementById('add');
  const title = document.querySelector('div.text-container > p');

  // Add listeners
  menuIcon.addEventListener('click', toggleSidebar);

  getConnectionStatus()
    .then(() => {
      if (userid !== undefined) {
        searchInput.addEventListener('input', runSearch);
        addBtn.addEventListener('click', submitSong);
      } else {
        searchInput.addEventListener('mouseenter', toggleSearchTooltip);
        searchInput.addEventListener('mouseleave', toggleSearchTooltip);
      }
      title.addEventListener('click', () => (window.location = 'index.html'));
    })
    .catch((e) => console.log(e));
}

function startUp() {
  // Fetch playlist information async
  loadPlaylist(PLAYLISTID);

  // Load music file
  loadMusic();

  init();

  // Loading screen before playlist fetching
  // const loadingIcon = document.getElementById("loadingIcon");
  // loadingIcon.style.display = "block";
}

function loadPlaylist(playlistId) {
  // Set up query url
  const endpoint = '/' + playlistId + '/songs';
  const url = new URL(backend + endpoint);

  // Fetch songs of the current playlist
  fetchRequest(url, 'GET')
    .then((res) => res.json())
    .then((json) => {
      // Children initialization and get list of added songs as json
      playlistData = json.results;

      // Display current playlistsongs on startup
      displayBatchPlaylist();
      // document.getElementById("loadingIcon").style.display = "none";
      if (userid !== undefined) highlightVotes();

      // Display the rest of the playlist
      setTimeout(backgroundPlaylist, 100);
    })
    .catch((e) => console.log(e));
}

function displayBatchPlaylist() {
  // Check if there is at least one song
  if (playlistData.length === 0) return;

  // List of songs div
  const playlistDiv = document.querySelector('div#list');

  // Batch display
  let endIndex = currentIndex + batchSize;
  for (let i = currentIndex; i < endIndex && i < playlistData.length; i++) {
    const song = playlistData[i].song;
    const songid = song.id.toString();

    // Create new playlist song div
    const resultDiv = document.querySelector('div.model.song').cloneNode(true);
    resultDiv.classList.toggle('model');
    const img = resultDiv.querySelector('span.cover-container > img');

    // Set attributes from json
    img.src = song.thumbnail;
    img.alt = song.album;
    resultDiv
      .querySelector('span.title')
      .appendChild(document.createTextNode(song.name + ','));
    resultDiv
      .querySelector('span.artist')
      .appendChild(document.createTextNode(song.artist));
    resultDiv
      .querySelector('span.votesnb')
      .appendChild(
        document.createTextNode(
          playlistData[i].votesNb == null ? 0 : playlistData[i].votesNb
        )
      );
    const voteImg = resultDiv.querySelector('span.vote > img');
    voteImg.dataset.id = songid;
    resultDiv.dataset.id = songid;
    resultDiv.dataset.preview = song.preview;
    resultDiv.dataset.uri = song.uri;

    //Add preview url
    resultDiv.querySelector('audio').src = song.preview;
    resultDiv.querySelector('audio').volume = 0.1;

    // Add current song to new children
    playlistDiv.appendChild(resultDiv);

    // Add to DOM and set up listeners
    if (userid !== undefined) voteImg.addEventListener('click', toggleVote);
    const title = resultDiv.querySelector('span.title');
    const artist = resultDiv.querySelector('span.artist');
    if (title.scrollWidth > title.offsetWidth) {
      title.classList.add('scroll');
    }
    if (artist.scrollWidth > artist.offsetWidth) {
      artist.classList.add('scroll');
    }
  }
  currentIndex = endIndex;
}

function backgroundPlaylist() {
  displayBatchPlaylist();

  if (userid !== undefined) highlightVotes();

  if (currentIndex < playlistData.length) {
    setTimeout(backgroundPlaylist, 100);
  }
}

function highlightVotes() {
  const songCollection = document.querySelectorAll('div#list > div.song');
  const subArray = Array.from(songCollection);
  const sliced = subArray.slice(currentIndex - batchSize, currentIndex);
  sliced.forEach(async (s) => {
    const voted = await userVoted(s.dataset.id);
    if (voted) {
      toggleVoteClass(s.querySelector('img.vote'));
    }
  });
}

async function userVoted(songid) {
  const url = new URL(backend + '/votes');
  const data = {
    userid: userid,
    playlistid: PLAYLISTID,
    songid: songid,
  };
  const voted = await fetchRequest(url, 'POST', JSON.stringify(data), token);
  return voted.status === 200;
}

async function toggleVote() {
  // Set up body
  const songId = parseInt(this.dataset.id);
  const data = {
    userId: userid,
    playlistId: PLAYLISTID,
    songId: songId,
  };

  // Set up url
  const endpoint = '/votes';
  const url = new URL(backend + endpoint);

  // Retrieve displayed vote element
  const voteSpan =
    this.parentElement.parentElement.querySelector('span.votesnb');

  // Vote if user has not voted yet
  if (!this.classList.contains('voted')) {
    // Add vote of the current user to the desired song
    const voted = await fetchRequest(url, 'PUT', JSON.stringify(data), token);

    // Update vote value
    if (voted.status === 201) {
      voteSpan.textContent = (parseInt(voteSpan.textContent) + 1).toString();
    }
  }
  // Unvote if user has already voted
  else {
    // Add vote of the current user to the desired song
    const unvoted = await fetchRequest(
      url,
      'DELETE',
      JSON.stringify(data),
      token
    );

    // Update vote value
    if (unvoted.status === 200) {
      voteSpan.textContent = (parseInt(voteSpan.textContent) - 1).toString();
    }
  }
  const updated = updateVotesTotal(PLAYLISTID, data.songId);
  if (updated) {
    toggleVoteClass(this);
  }
}

async function deletePlaylistSong(playlistId, songId) {
  const endpoint = '/' + playlistId + '/' + songId;
  const url = new URL(backend + endpoint);

  return fetchRequest(url, 'DELETE', undefined, token);
}

async function updateVotesTotal(playlistId, songId) {
  //TODO merge this function in backend
  // Set up body
  const data = {
    playlistId: playlistId,
    songId: songId,
  };

  // Set up url
  const endpoint = '/votes';
  const url = new URL(backend + endpoint);

  await fetchRequest(url, 'PATCH', JSON.stringify(data), token);
}

function submitSong() {
  const searchInput = document.getElementById('search');
  if (!searchInput.value || searchResults.length === 0) return;
  const option = document.querySelector(
    'option[value=' + JSON.stringify(searchInput.value) + ']'
  );
  if (!option) return;

  // Try to add the searched song to the current playlist
  findOrAddSong(
    PLAYLISTID,
    userid,
    option.dataset.name,
    option.dataset.artist,
    option.dataset.album,
    option.dataset.thumbnail,
    option.dataset.preview,
    option.dataset.uri
  );
}

async function findOrAddSong(
  playlistId,
  userId,
  name,
  artist,
  album,
  thumbnail,
  preview,
  uri
) {
  // Set up query url and body
  const songEndpoint = '/songs';
  const url = new URL(backend + songEndpoint);
  const data = {
    name: name,
    album: album,
    artist: artist,
    thumbnail: thumbnail,
    preview: preview,
    uri: uri,
  };
  const globalFound = await searchInSongs(data, url);
  //If the song isn't in any playlist, add to songs and playlist
  if (globalFound.status === 404) {
    const added = await addToSongs(data, url);
    if (added.status === 201) {
      const res = await added.json();
      addToPlaylist(res, playlistId, userId).catch((e) => console.log(e));
    }
  } // If a song was found, check if it's in playlist
  else {
    const res = await globalFound.json();
    const localFound = await searchInPlaylist(res, playlistId).catch((e) =>
      console.log(e)
    );
    if (localFound.status === 404) {
      addToPlaylist(res, playlistId, userId).catch((e) => console.log(e));
    } else {
      const res = await localFound.json();
      const foundSong = document.querySelector(
        'div.song[data-id="' + res.playlistSong.songId + '"]'
      );
      foundSong.style.borderColor = 'white';
      setTimeout(() => {
        foundSong.style.borderColor = '';
      }, 3000);
      foundSong.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }
  resetSearch();
}

async function addToPlaylist(promiseResult, playlistId, userId) {
  // Set up query url and body
  const playlistEndPoint = '/' + playlistId;
  const songEndpoint = '/songs';
  const songId = promiseResult.song.id;
  // if (isInt(song.id)) songId = parseInt(id);
  const data = {
    songId: songId,
    votesNb: 1,
    submitterId: userId,
  };
  const songUrl = new URL(backend + playlistEndPoint + songEndpoint);

  // Add song to playlist
  await fetchRequest(songUrl, 'PUT', JSON.stringify(data), token);

  // Set up user vote data and url
  const voteData = {
    userId: userid,
    playlistId: PLAYLISTID,
    songId: songId,
  };
  const endpoint = '/votes';
  const voteUrl = new URL(backend + endpoint);

  // Add vote of the current user to the desired song
  await fetchRequest(voteUrl, 'PUT', JSON.stringify(voteData), token);

  // Display the added song
  document.getElementById('list').innerHTML = '';
  currentIndex = 0;
  loadPlaylist(PLAYLISTID);
}

async function searchInPlaylist(promiseResult, playlistId) {
  // Set up query url and body
  const playlistEndPoint = '/' + playlistId;
  const songId = promiseResult.song.id;
  const playlistSongEndpoint = playlistEndPoint + '/' + songId + '/';
  const url = new URL(backend + playlistSongEndpoint);

  // Look for song in playlist
  return fetchRequest(url, 'POST', undefined, token);
}

function searchInSongs(data, url) {
  // Look for song in the global song database
  return fetchRequest(url, 'POST', JSON.stringify(data), token);
}

function addToSongs(data, url) {
  // Add a song to the global song databse
  return fetchRequest(url, 'PUT', JSON.stringify(data), token);
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
    newOption.dataset.preview = r.preview;
    newOption.dataset.uri = r.uri;
    optNodes.push(newOption);
  });
  datalist.replaceChildren(...optNodes);
  document.querySelector('input#search').setAttribute('open', 'true');
}

async function runSearch(e) {
  // When pressing Enter or given 2+ characters, fetch 5 search results
  if (e.key === 'Enter' || this.value.length > 2) {
    this.style.disabled = true;
    // Set up query url
    const endPoint = '/runSearch';
    const url = new URL(backend + endPoint);

    // Fetch(url, { method: "GET" });
    const extractedResults = await fetchRequest(
      url,
      'POST',
      JSON.stringify({ name: this.value }),
      token
    )
      .then((res) => res.json())
      .catch((e) => console.log(e));

    // Process search results
    if (
      extractedResults !== undefined &&
      extractedResults.results !== undefined
    ) {
      const results = extractedResults.results.tracks.items.map((s) => ({
        artist: s.album.artists[0].name,
        album: s.album.name,
        name: s.name,
        uri: s.uri,
        preview: s.preview_url,
        thumbnail: s.album.images[s.album.images.length - 1].url, //Get smallest image url
      }));

      // Display search results as clickable options
      searchResults = results;
      displayResults(results);
    }
  }
}

function toggleVoteClass(element) {
  element.classList.toggle('voted');
}

function toggleSearchTooltip() {
  document
    .querySelector('div.search-input > span.tooltip')
    .classList.toggle('shown');
}

window.addEventListener('load', startUp);
