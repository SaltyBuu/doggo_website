// import { toggleMute, toggleSidebar } from './lib.js';
const backend = "https://api-doggo.herokuapp.com";
const PLAYLISTID = 1;
let userid = 1;
let token = undefined;
//TODO admin account verify token
let currentResults = [];
const audio = new Audio("music/bee-gees-stayin-alive.wav");

// Common int validation function
const isInt = function (id) {
  return !isNaN(id) && parseInt(Number(id)) == id && !isNaN(parseInt(id, 10));
};

function init() {
  // DOM queries
  const menuIcon = document.querySelector("#menu-icon-bg");
  const muteSpan = document.getElementById("mute");
  const signinBtn = document.getElementById("signin-btn");
  const searchInput = document.getElementById("search");
  const addBtn = document.getElementById("add");

  // Add listeners
  menuIcon.addEventListener("click", toggleSidebar);
  muteSpan.addEventListener("click", () => toggleMute(audio));
  signinBtn.addEventListener(
    "click",
    () => (window.location.href = "/signin.html")
  );
  searchInput.addEventListener("keypress", runSearch);
  addBtn.addEventListener("click", submitSong);
  console.log("Token:", localStorage.accessToken);
  if (localStorage.accessToken !== undefined) {
    //TODO valid token route + loading request
    signinBtn.classList.toggle("connected");
    signinBtn.value = localStorage.user;
    console.log("Local user:", localStorage.user);
    token = localStorage.accessToken;
    userid = parseInt(localStorage.userid);
  }
  console.log("Local user ID:", userid);
}

function startUp() {
  init();
  // Display current playlistsongs on startup
  refreshPlaylist(PLAYLISTID);

  // Music controls
  audio.preload = "auto";
  audio.volume = 0.1;
  audio.loop = true;

  //refresh without addinglistener
}

function refreshPlaylist(playlistId) {
  console.log("REFRESHING");
  // Set up query url
  const endpoint = "/" + playlistId + "/songs";
  const url = new URL(backend + endpoint);

  // Fetch songs of the current playlist
  fetchRequest(url, "GET")
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      // Children initialization and get list of added songs as json
      const newChildren = [];
      const results = json.results;
      console.log("Results:", results);

      // Check if there is at least one song
      if (results === null || results === undefined || results.length !== 0)
        return;

      // List of songs div
      const playlistDiv = document.querySelector("div.list");

      // Parse playlist songs json
      results.forEach((r) => {
        console.log('For each');
        // console.log(r.song);
        const song = r.song;
        const songid = song.id.toString();
        //TODO Remplacer par requêtes sur les votes pour ne pas stocker l'id comme ça
        //TODO middleware de décryptage du token

        // Create new playlist song div
        const resultDiv = document
          .querySelector("div.model.song")
          .cloneNode(true);
        resultDiv.classList.toggle("model");
        const img = resultDiv.querySelector("span.cover-container > img");

        // Set attributes from json
        img.src = song.thumbnail;
        img.alt = song.album;
        resultDiv
          .querySelector("span.title")
          .appendChild(document.createTextNode(song.name));
        resultDiv
          .querySelector("span.artist")
          .appendChild(document.createTextNode(song.artist));
        // console.log('votesNb', r.votesNb);
        resultDiv
          .querySelector("span.votesNb")
          .appendChild(
            document.createTextNode(r.votesNb == null ? 0 : r.votesNb)
          );
        const voteImg = resultDiv.querySelector("span.vote > img");
        voteImg.dataset.id = songid;
        resultDiv.dataset.id = songid;

        // Add current song to new children
        newChildren.push(resultDiv);
      });
      console.log('Old children:', playlistDiv.children);
      console.log('New children:', [...newChildren]);
      // Add to DOM and set up listeners
      playlistDiv.replaceChildren(...newChildren);
      [...playlistDiv.children].forEach((child) => {
        const voteImg = child.querySelector("span.vote > img");
        voteImg.addEventListener("click", toggleVote);
        const title = child.querySelector("span.title");
        if (title.scrollWidth > title.offsetWidth) {
          title.classList.add("scroll");
        }
        // voteImg.addEventListener('click', toggleVote)
      });
      highlightVotes();
    })
    .catch((e) => console.log(e));
}

function highlightVotes() {
  const songCollection = document.querySelectorAll("div.list > div.song");
  songCollection.forEach(async (s) => {
    const voted = await userVoted(s.dataset.id);
    if (voted) {
      toggleVoteClass(s.querySelector("img.vote"));
    }
  });
}

async function userVoted(songid) {
  const url = new URL(backend + "/votes");
  const data = {
    userid: userid,
    playlistid: PLAYLISTID,
    songid: songid,
  };
  const voted = await fetchRequest(url, "POST", JSON.stringify(data), token);
  return voted.status === 200;
}

async function toggleVote() {
  //TODO handle unvote
  //TODO increment votesNb

  // Set up body
  const songId = parseInt(this.dataset.id);
  console.log("this", this);
  const data = {
    userId: userid,
    playlistId: PLAYLISTID,
    songId: songId,
  };

  // Set up url
  console.log("Body addVote", JSON.stringify(data));
  const endpoint = "/votes";
  const url = new URL(backend + endpoint);

  // Retrieve displayed vote element
  const voteSpan =
    this.parentElement.parentElement.querySelector("span.votesNb");

  // Vote if user has not voted yet
  if (!this.classList.contains("voted")) {
    console.log("User has not yet voted !");

    // Add vote of the current user to the desired song
    const voted = await fetchRequest(url, "PUT", JSON.stringify(data), token);
    if (voted) {
      console.log("Vote: ", voted);
    } else {
      console.log("no vote: ", voted);
    }

    // Update vote value
    if (voted) {
      voteSpan.textContent = (parseInt(voteSpan.textContent) + 1).toString();
      console.log("+1");
    }
  }
  // Unvote if user has already voted
  else {
    console.log("User has already voted !");
    // Add vote of the current user to the desired song
    const unvoted = await fetchRequest(
      url,
      "DELETE",
      JSON.stringify(data),
      token
    );

    // Update vote value
    if (unvoted) {
      voteSpan.textContent = (parseInt(voteSpan.textContent) - 1).toString();
      console.log("-1");
      if (voteSpan.textContent === "0") {
        const deleted = await deletePlaylistSong(PLAYLISTID, songId);
        if (deleted.status === 200) {
          console.log("Status 200 !");
          const currentId = this.dataset.id;
          console.log("Get id");
          const currentDiv = document.querySelector(
            'div[data-id="' + currentId + '"]'
          );
          console.log("Div:", currentDiv);
          currentDiv.remove();
          return;
        }
      }
    }
  }
  const updated = updateVotesTotal(PLAYLISTID, data.songId);
  if (updated) {
    console.log("Updated !");
    toggleVoteClass(this);
  } else {
    console.log("Not updated :(");
  }
}

async function deletePlaylistSong(playlistId, songId) {
  const endpoint = "/" + playlistId + "/" + songId;
  const url = new URL(backend + endpoint);
  console.log(url.href);

  return fetchRequest(url, "DELETE", undefined, token);
}

async function updateVotesTotal(playlistId, songId) {
  // Set up body
  const data = {
    playlistId: playlistId,
    songId: songId,
  };

  // Set up url
  console.log("Body addVote", JSON.stringify(data));
  const endpoint = "/votes";
  const url = new URL(backend + endpoint);

  const updated = await fetchRequest(url, "PATCH", JSON.stringify(data), token);

  if (updated) console.log("Updated song n°", songId);
}

function submitSong() {
  // Get user search input
  const searchInput = document.getElementById("search");
  if (!searchInput.value || currentResults.length === 0) return;
  const option = document.querySelector(
    'option[value="' + searchInput.value + '"]'
  );
  if (!option) return;
  console.log(searchInput.value);

  // Try to add the searched song to the current playlist
  findOrAddSong(
    PLAYLISTID,
    userid,
    option.dataset.name,
    option.dataset.artist,
    option.dataset.album,
    option.dataset.thumbnail
  );
}

async function findOrAddSong(
  playlistId,
  userId,
  name,
  artist,
  album,
  thumbnail
) {
  // Set up query url and body
  const songEndpoint = "/songs";
  const url = new URL(backend + songEndpoint);
  const data = {
    name: name,
    album: album,
    artist: artist,
    thumbnail: thumbnail,
  };
  const globalFound = await searchInSongs(data, url);
  // console.log('1globalFound', globalFound);
  //If the song isn't in any playlist, add to songs and playlist
  if (globalFound.status === 404) {
    // console.log('Song doesnt exist in any playlist !');
    const added = await addToSongs(data, url);
    // console.log('added promise:', added);
    if (added.status === 201) {
      // console.log('Song added to global songs !');
      const res = await added.json();
      addToPlaylist(res, playlistId, userId).catch((e) => console.log(e));
    }
  } // If a song was found, check if in playlist
  else {
    const res = await globalFound.json();
    // console.log('2globalFound: ', globalFound);
    // console.log('Song already exists !');
    const localFound = await searchInPlaylist(res, playlistId).catch((e) =>
      console.log(e)
    );
    // console.log('3globalFound: ', globalFound);
    // console.log('LocalFound:', localFound.json());
    if (localFound.status === 404) {
      // console.log('4globalFound: ', globalFound);
      // console.log('Song isnt in current playlist');
      addToPlaylist(res, playlistId, userId).catch((e) => console.log(e));
    } else {
      console.log("Found", localFound);
      //TODO Scroll to song
    }
  }
  resetSearch();
}

async function addToPlaylist(promiseResult, playlistId, userId) {
  // Set up query url and body
  const playlistEndPoint = "/" + playlistId;
  const songEndpoint = "/songs";
  const songId = promiseResult.song.id;
  // if (isInt(song.id)) songId = parseInt(id);
  const data = {
    songId: songId,
    votesNb: 1,
    submitterId: userId,
  };
  const songUrl = new URL(backend + playlistEndPoint + songEndpoint);

  // Add song to playlist
  await fetchRequest(songUrl, "PUT", JSON.stringify(data), token);

  // Set up user vote data and url
  const voteData = {
    userId: userid,
    playlistId: PLAYLISTID,
    songId: songId,
  };
  const endpoint = "/votes";
  const voteUrl = new URL(backend + endpoint);

  // Add vote of the current user to the desired song
  const voted = await fetchRequest(
    voteUrl,
    "PUT",
    JSON.stringify(voteData),
    token
  );
  if (voted) {
    console.log("Vote: ", voted);
  } else {
    console.log("no vote: ", voted);
  }

  // Display the added song
  refreshPlaylist(PLAYLISTID);
}

async function searchInPlaylist(promiseResult, playlistId) {
  // Set up query url and body
  const playlistEndPoint = "/" + playlistId;
  const songId = promiseResult.song.id;
  // if (isInt(song.id)) songId = parseInt(id);
  const playlistSongEndpoint = playlistEndPoint + "/" + songId + "/";
  const url = new URL(backend + playlistSongEndpoint);

  // console.log('Look in playlist !');
  // Look for song in playlist
  return fetchRequest(url, "POST", undefined, token);
}

function searchInSongs(data, url) {
  // Look for song in the global song database
  return fetchRequest(url, "POST", JSON.stringify(data), token);
}

function addToSongs(data, url) {
  // Add a song to the global song databse
  return fetchRequest(url, "PUT", JSON.stringify(data), token);
}

function resetSearch() {
  const searchInput = document.getElementById("search");
  searchInput.value = "";
}

function displayResults(results) {
  const datalist = document.getElementById("searchResults");
  const optNodes = [];
  const option = document.querySelector("option.model.result");
  results.forEach((r) => {
    const newOption = option.cloneNode();
    newOption.value = r.name + ", " + r.artist;
    newOption.className = "searchResult";
    newOption.dataset.album = r.album;
    newOption.dataset.name = r.name;
    newOption.dataset.artist = r.artist;
    newOption.dataset.thumbnail = r.thumbnail;
    optNodes.push(newOption);
  });
  console.log(optNodes);
  datalist.replaceChildren(...optNodes);
  document.querySelector("input#search").setAttribute("open", "true");
}

async function runSearch(e) {
  // When pressing Enter or given 2+ characters, fetch 5 search results
  if (e.key === "Enter" || this.value.length > 2) {
    this.style.disabled = true;
    // Set up query url
    const endPoint = "/runSearch";
    const url = new URL(backend + endPoint);

    // Fetch(url, { method: "GET" });
    console.log("Requête spotify :", url);
    const extractedResults = await fetchRequest(
      url,
      "POST",
      JSON.stringify({ name: this.value }),
      token
    )
      .then((res) => res.json())
      .catch((e) => console.log(e));
    console.log("ExtractedResults", extractedResults);

    // Process search results
    if (
      extractedResults !== undefined &&
      extractedResults.results !== undefined
    ) {
      const results = extractedResults.results.tracks.items.map((s) => ({
        artist: s.album.artists[0].name,
        album: s.album.name,
        name: s.name,
        thumbnail: s.album.images[s.album.images.length - 1].url, //Get smallest image url
      }));

      console.log("Results", results);
      // Display search results as clickable options
      currentResults = results;
      displayResults(results);
    }
  }
}

function toggleVoteClass(element) {
  element.classList.toggle("voted");
}

window.addEventListener("load", startUp);
