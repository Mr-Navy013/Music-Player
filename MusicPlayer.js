let musicList = [
  {
    name: "Sky Fall",
    artist: "Adele",
    image: "imageSkyfall.png",
    path: "SkyFall.mpeg",
  },
  {
    name: "Hislerim",
    artist: "Serhat Durmus",
    image: "imageHislerim.png",
    path: "Hislerim.mpeg",
  }
];

let nowPlaying = document.getElementById("now-playing");
let musicImage = document.getElementById("music-image");
let musicName = document.getElementById("music-name");
let artistName = document.getElementById("artist-name");
let seekSlider = document.querySelector(".seek_slider");
let startTime = document.getElementById("starting-time");
let endTime = document.getElementById("End-time");
let shuffleBtn = document.getElementById("shuffle");
let playBtn = document.getElementById("play");
let nextBtn = document.getElementById("next");
let prevBtn = document.getElementById("previous");
let musicListBtn = document.getElementById("music-list");

// Audio 
let currentTrack = new Audio();
let trackIndex = 0;
let isPlaying = false;
let isShuffle = false;
let updateTimer;

function loadTrack(index) {
  clearInterval(updateTimer);
  resetValues();

  currentTrack.src = musicList[index].path;
  currentTrack.load();

  musicImage.style.backgroundImage = `url(${musicList[index].image})`;
  musicName.textContent = musicList[index].name;
  artistName.textContent = musicList[index].artist;
  nowPlaying.innerHTML = `<span>Creator: NVY</span> Playing ${index + 1} of ${
    musicList.length
  }`;

  updateTimer = setInterval(seekUpdate, 1000);

  currentTrack.addEventListener("ended", () =>{
    if (isShuffle){
      loadTrack(trackIndex);
      playPauseTrack();
    } else {
      nextTrack();
    }
  });
}

// Reset values
function resetValues() {
  startTime.textContent = "00:00";
  endTime.textContent = "00:00";
  seekSlider.value = 0;
}

// Play / Pause
function playPauseTrack() {
  if (!isPlaying) {
    currentTrack.play();
    isPlaying = true;
    playBtn.src = "pause.png";
    rotateImage(true);
  } else {
    currentTrack.pause();
    isPlaying = false;
    playBtn.src = "play.png";
    rotateImage(false);
  }
}

// Next Track
function nextTrack() {
  if (isShuffle) {
    trackIndex = Math.floor(Math.random() * musicList.length);
  } else {
    trackIndex = (trackIndex + 1) % musicList.length;
  }
  loadTrack(trackIndex);
  playPauseTrack();
}

// Previous Track
function prevTrack() {
  trackIndex = (trackIndex - 1 + musicList.length) % musicList.length;
  loadTrack(trackIndex);
  playPauseTrack();
}

// Seek Function
function seekTo() {
  let seekto = currentTrack.duration * (seekSlider.value / 100);
  currentTrack.currentTime = seekto;
}

// Update Seek Slider
function seekUpdate() {
  let seekPosition = 0;
  if (!isNaN(currentTrack.duration)) {
    seekPosition = currentTrack.currentTime * (100 / currentTrack.duration);
    seekSlider.value = seekPosition;

    let currentMinutes = Math.floor(currentTrack.currentTime / 60);
    let currentSeconds = Math.floor(currentTrack.currentTime % 60);
    let durationMinutes = Math.floor(currentTrack.duration / 60);
    let durationSeconds = Math.floor(currentTrack.duration % 60);

    if (currentSeconds < 10) {
      currentSeconds = "0" + currentSeconds;
    }
    if (durationSeconds < 10) {
      durationSeconds = "0" + durationSeconds;
    }
    if (currentMinutes < 10) {
      currentMinutes = "0" + currentMinutes;
    }
    if (durationMinutes < 10) {
      durationMinutes = "0" + durationMinutes;
    }

    startTime.textContent = currentMinutes + ":" + currentSeconds;
    endTime.textContent = durationMinutes + ":" + durationSeconds;
  }
}

// Shuffle
function toggleShuffle() {
  isShuffle = !isShuffle;
  shuffleBtn.style.filter = isShuffle ? "invert(0.5)" : "invert(1)";
}

// Music List Show
function showMusicList() {
  let popup = document.getElementById("music-popup");
  let listContainer = document.getElementById("music-list-container");

  
  listContainer.innerHTML = "";


  musicList.forEach((track, i) => {
    let li = document.createElement("li");
    li.textContent = `${i + 1}. ${track.name} - ${track.artist}`;
    li.addEventListener("click", () => {
      trackIndex = i; // 
      loadTrack(trackIndex); 
      playPauseTrack(); 
      popup.style.display = "none";
    });
    listContainer.appendChild(li);
  });

  // Popup show 
  popup.style.display = "block";

  // Close pop up
  document.addEventListener("click", function closePopup(e) {
    if (!popup.contains(e.target) && e.target.id !== "music-list") {
      popup.style.display = "none";
      document.removeEventListener("click", closePopup);
    }
  });
}


// Image Rotate Animation in z-Axis
function rotateImage(start) {
  if (start) {
    musicImage.style.animation = "spin 30s linear infinite";
  } else {
    musicImage.style.animation = "none";
  }
}

// CSS animation
let style = document.createElement("style");
style.innerHTML = `
@keyframes spin {
    from { transform: rotateZ(0deg); }
    to { transform: rotateZ(360deg); }
}`;
document.head.appendChild(style);

// Event Listeners
playBtn.addEventListener("click", playPauseTrack);
nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);
shuffleBtn.addEventListener("click", toggleShuffle);
musicListBtn.addEventListener("click", showMusicList);

// load
loadTrack(trackIndex);
