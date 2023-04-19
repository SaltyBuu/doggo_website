function toggleSidebar() {
  // const menuIconDiv = document.getElementById('menu-icon-bg');
  const toggleMenuDiv = document.getElementById('toggle-menu');
  this.classList.toggle('pulled');
  toggleMenuDiv.classList.toggle('pulled');
  // toggleMenuDiv.style.display =
  //   toggleMenuDiv.style.display === 'none' ? '' : 'none';
  console.log('ou');
}

function toggleMute(audio) {
  audio.muted = audio.muted !== true;
  document.querySelector('.mute-icon').classList.toggle('hidden');
  document.querySelector('.soundon-icon').classList.toggle('hidden');
}

function fetchRequest(url, method, body, token) {
  return fetch(url, {
    method: method,
    headers: {
      'content-type': 'application/json; charset=UTF-8',
      'x-access-token': token,
    },
    body: body,
  });
}
