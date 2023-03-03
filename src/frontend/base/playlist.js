import { toggleMute } from './lib.js';
import { toggleSidebar } from './lib.js';

function startUp() {
  const menuIcon = document.querySelector('#menu-icon-bg');
  const muteSpan = document.getElementById('mute');
  const audio = new Audio('../music/bee-gees-stayin-alive.wav');
  const signinBtn = document.getElementById('signinBtn');
  menuIcon.addEventListener('click', toggleSidebar);
  muteSpan.addEventListener('click', () => toggleMute(audio));
  // let audio = new Audio("../music/bee-gees-stayin-alive.mp3"); //try catch
  audio.preload = 'auto';
  audio.volume = 0.1;
  audio.loop = true;
  signinBtn.addEventListener(
    'click',
    () => (window.location.href = 'signin.html')
  );
}

window.addEventListener('load', startUp);
