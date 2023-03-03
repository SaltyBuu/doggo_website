import { toggleMute } from './lib.js';
import { toggleSidebar } from './lib.js';
function startUp() {
  const menuIcon = document.querySelector('#menu-icon-bg');
  const muteSpan = document.getElementById('mute');
  const audio = new Audio('../music/bee-gees-stayin-alive.wav');
  const signinBtn = document.getElementById('signinBtn');
  const registerBtn = document.getElementById('registerBtn');

  menuIcon.addEventListener('click', toggleSidebar);
  muteSpan.addEventListener('click', () => toggleMute(audio));
  audio.preload = 'auto';
  audio.volume = 0.1;
  audio.loop = true;
  signinBtn.addEventListener(
    'click',
    () => (window.location.href = 'playlist.html')
  );
  registerBtn.addEventListener(
    'click',
    () => (window.location.href = 'signin.html')
  );
}

window.addEventListener('load', startUp);
