const $book = $(".flipbook");

const music = document.getElementById("bgMusic");

const BASE_WIDTH = 1000;
const BASE_HEIGHT = 647;

let musicStarted = false;

/* -------------------------
   RESPONSIVE SCALE
-------------------------*/
function getScale() {
  const padding = 20;

  const availableWidth = window.innerWidth - padding;
  const availableHeight = window.innerHeight - padding;

  return Math.min(
    availableWidth / BASE_WIDTH,
    availableHeight / BASE_HEIGHT,
    1
  );
}

function resizeBook() {
  const scale = getScale();

  $book.turn("size",
    BASE_WIDTH * scale,
    BASE_HEIGHT * scale
  );
}

/* -------------------------
   FADE IN MUSIC (LONG)
-------------------------*/
function fadeInAudio(audio, targetVolume = 0.3, duration = 3000) {
  audio.volume = 0.2;

  const steps = 80;
  const stepTime = duration / steps;
  const volumeStep = targetVolume / steps;

  let currentStep = 0;

  const fade = setInterval(() => {
    currentStep++;

    audio.volume = Math.min(volumeStep * currentStep, targetVolume);

    if (currentStep >= steps) {
      clearInterval(fade);
    }
  }, stepTime);
}

/* -------------------------
   FLIP SOUND (START AT 3s)
-------------------------*/
function playFlipSound() {
  const sound = new Audio("flip.mp3");

  sound.currentTime = 2.2; // ⬅️ start at 3 seconds
  sound.volume = 1;
  sound.playbackRate = 1.05;

  sound.play().catch(() => {});
}

/* -------------------------
   INIT FLIPBOOK
-------------------------*/
$(function () {

  $book.turn({
    width: BASE_WIDTH,
    height: BASE_HEIGHT,
    display: "double",
    autoCenter: true,
    acceleration: true,
    gradients: true,
    duration: 2200,

    when: {

      start: () => $book.addClass("is-turning"),
      end: () => $book.removeClass("is-turning"),

      /* 🔊 PAGE FLIP SOUND */
      turning: function () {
        playFlipSound();
      },

      /* 🎵 MUSIC START */
      turned: function (e, page) {

        if (page >= 6 && !musicStarted) {

          musicStarted = true;

          music.currentTime = 130; // 2:05 start

          music.play()
            .then(() => {
              fadeInAudio(music, 0.5, 8000);
            })
            .catch(() => {});
        }
      }
    }
  });

  resizeBook();

  window.addEventListener("resize", () => {
    requestAnimationFrame(resizeBook);
  });

  window.addEventListener("orientationchange", () => {
    setTimeout(resizeBook, 200);
  });

});