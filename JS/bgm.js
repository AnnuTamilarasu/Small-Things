const bgMusic = document.getElementById('bgMusic');
const musicControl = document.getElementById('musicControl');
const musicIcon = document.getElementById('musicIcon');

let isPlaying = false;

// Start music on user interaction (required by browsers)
function startMusic() {
  bgMusic.volume = 1; // Set volume to 30% (adjust as needed)
  bgMusic.play().catch(err => {
    console.log('Autoplay prevented:', err);
  });
  isPlaying = true;
  musicIcon.textContent = '🔊';
}

// Toggle music on/off
if (musicControl) {
  musicControl.addEventListener('click', () => {
    if (isPlaying) {
      bgMusic.pause();
      isPlaying = false;
      musicIcon.textContent = '🔇';
    } else {
      bgMusic.play();
      isPlaying = true;
      musicIcon.textContent = '🔊';
    }
  });
}

// Auto-start music on first user interaction
document.addEventListener('click', function initMusic() {
  if (!isPlaying) {
    startMusic();
  }
  // Remove listener after first interaction
  document.removeEventListener('click', initMusic);
}, { once: true });