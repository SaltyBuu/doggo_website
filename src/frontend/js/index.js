function startUp() {
  loadMusic();
  const menuIcon = document.querySelector('#menu-icon-bg');
  const voteBtn = document.getElementById('vote-btn');

  menuIcon.addEventListener('click', toggleSidebar);
  voteBtn.addEventListener(
    'click',
    () => (window.location.href = 'playlist.html')
  );
  getConnectionStatus().catch((e) => console.log(e));
}

window.addEventListener('load', startUp);
