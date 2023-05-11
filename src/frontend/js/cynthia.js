window.addEventListener('load', startUp);
const PLAYLISTID = 1;
let token = undefined;
let userid = undefined;
function startUp() {
  const signinBtn = document.getElementById('signin-btn');
  const exportBtn = document.getElementById('export');
  const title = document.getElementsByTagName('h1')[0];
  signinBtn.addEventListener('click', userLogin);
  exportBtn.addEventListener('click', exportToFile);
  title.addEventListener('click', () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userid');
    window.location.href = 'playlist.html';
  });
  // document.getElementById('manager').classList.toggle('hidden');
  (async () => {
    if (await validToken(localStorage.accessToken)) {
      token = localStorage.accessToken;
      userid = parseInt(localStorage.userid);
      document.getElementById('login-form').style.display = 'none';
      document.getElementById('manager').classList.toggle('hidden');
    }
  })();
  refreshPlaylist(PLAYLISTID);
}

async function userLogin() {
  const signDiv = document.querySelector('#login-form');
  const login = signDiv.getElementsByTagName('input')[0].value.toLowerCase();
  const password = signDiv.getElementsByTagName('input')[1].value;
  const hashed = await hashPass(password);
  const data = {
    login: login,
    password: hashed,
  };
  sendCredentials(data);
}

async function exportToFile() {
  const csvRows = ['name,artist'];
  const response = await fetchRequest(
    new URL(backend + '/' + PLAYLISTID + '/songs'),
    'GET',
    null,
    token
  ).catch((e) => console.log(e));

  const json = await response.json();
  let rank = 1;
  json.results.forEach((r) => {
    csvRows.push(rank.toString() + ',' + r.song.name + ',' + r.song.artist);
    rank++;
  });

  const blob = new Blob([csvRows.join('\n')], {
    type: 'text/csv;charset=utf-8',
  });
  const date = new Date().toLocaleDateString('fr');
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(blob);
  anchor.download = 'doggo_exported_playlist' + '-' + date;
  anchor.click();
  URL.revokeObjectURL(anchor.href);
}

async function hashPass(password) {
  const hashDigest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(password)
  );
  const hashArray = Array.from(new Uint8Array(hashDigest));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function sendCredentials(data) {
  const url = new URL(backend + '/adminAuth');
  fetchRequest(url, 'POST', JSON.stringify(data))
    .then((res) => {
      if (res.status === 200) {
        res.json().then((json) => {
          token = json.token;
          localStorage.accessToken = json.token;
          userid = json.userid;
          localStorage.userid = json.userid;
          document.getElementById('login-form').style.display = 'none';
          document.getElementById('manager').classList.toggle('hidden');
        });
      }
      if (res.status === 403) {
        res.json().then(() => {
          const passwordInput = document.querySelector(
            '.inputs > input[name="password"]'
          );
          passwordInput.setCustomValidity('');
          passwordInput.checkValidity();
          passwordInput.setCustomValidity('Invalid login or password.');
          passwordInput.reportValidity();
        });
      }
    })
    .catch((e) => console.log(e));
}

function refreshPlaylist(playlistId) {
  // Set up query url
  const endpoint = '/' + playlistId + '/songs';
  const url = new URL(backend + endpoint);

  // Fetch songs of the current playlist
  fetchRequest(url, 'GET')
    .then((res) => res.json())
    .then((json) => {
      // Children initialization and get list of added songs as json
      const newChildren = [];
      const results = json.results;

      // Check if there is at least one song
      if (results === null || results === undefined || results.length === 0)
        return;

      // List of songs div
      const playlistDiv = document.querySelector('div.list');

      // Parse playlist songs json
      results.forEach((r) => {
        const song = r.song;
        const songid = song.id.toString();
        //TODO Remplacer par requêtes sur les votes pour ne pas stocker l'id comme ça
        //TODO middleware de décryptage du token

        // Create new playlist song div
        const resultDiv = document
          .querySelector('div.model.song')
          .cloneNode(true);
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
            document.createTextNode(r.votesNb == null ? 0 : r.votesNb)
          );
        resultDiv.dataset.id = songid;
        resultDiv.dataset.uri = song.uri;

        // Add current song to new children
        newChildren.push(resultDiv);

        // Remove effect to button
        resultDiv
          .querySelector('button.delete')
          .addEventListener('click', () => {
            fetchRequest(
              new URL(backend + '/' + PLAYLISTID + '/' + songid),
              'DELETE',
              JSON.stringify({ playlistId: PLAYLISTID }),
              token
            )
              .then((r) => {
                if (r.status === 200) {
                  refreshPlaylist(PLAYLISTID);
                }
              })
              .catch((e) => console.log(e));
          });
      });

      // Add to DOM and set up listeners
      playlistDiv.replaceChildren(...newChildren);
      [...playlistDiv.children].forEach((child) => {
        const title = child.querySelector('span.title');
        const artist = child.querySelector('span.artist');
        if (title.scrollWidth > title.offsetWidth) {
          title.classList.add('scroll');
        }
        if (artist.scrollWidth > artist.offsetWidth) {
          artist.classList.add('scroll');
        }
      });
    })
    .catch((e) => console.log(e));
}
