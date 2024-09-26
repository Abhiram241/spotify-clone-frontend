console.log("I love you 3000");
let folder_name = "My_Picks-My_fav_songs";
let current_song = new Audio(
  `/spotify_clone/songs/${folder_name}/Bye%20Bye%20Bye.mp3`
);
let current_song_index = 1;
let current_playlist = "My Picks";
document.querySelector(".songinfo").innerHTML = `Bye Bye Bye - Mystery Guy`;
document.querySelector(".songtime").innerHTML = "00:00/03:20";

async function getPlaylists() {
  let p = await fetch(`/spotify_clone/songs/`);
  let response = await p.text();

  let div = document.createElement("div");
  div.innerHTML = response;

  let links = div.querySelectorAll("table a");
  let playlists = [];
  let og_playlist = [];
  let payload = [];
  let image_url = [];
  let playlist_description = [];

  for (let i = 1; i < links.length; i++) {
    let pname = links[i].href;
    let og_pname = pname.split(`/spotify_clone/songs/`)[1];
    let p_name = pname
      .split(`/spotify_clone/songs/`)[1]
      .replaceAll("%20", " ")
      .replaceAll("_", " ")
      .replace(/.$/, "")
      .split("-")[0];
    let p_des = pname
      .split(`/spotify_clone/songs/`)[1]
      .replaceAll("%20", " ")
      .replaceAll("_", " ")
      .replace(/.$/, "")
      .split("-")[1];
    //fetch the image url
    let image_process = await fetch(
      `/spotify_clone/songs/${og_pname}`
    );

    let img_resp = await image_process.text();
    let div = document.createElement("div");
    div.innerHTML = img_resp;
    let ilinks = div.querySelectorAll("table a");
    for (let index = 0; index < ilinks.length; index++) {
      if (ilinks[index].href.endsWith(".jpeg")) {
        image_url.push(ilinks[index].href);

        break;
      }
    }

    //resume the old process
    playlists.push(p_name);
    og_playlist.push(og_pname);
    playlist_description.push(p_des);
  }
  payload.push(og_playlist, playlists, image_url, playlist_description);
  return payload;
}

async function getSongs(folder_name) {
  let a = await fetch(
    `/spotify_clone/songs/${folder_name}/`
  );
  // fetch api is a basic way of fetch content from a link
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  //   see why the above statement is valid
  let as = div.getElementsByTagName("a");
  let songs = [];
  var songs_full = [];
  for (let index = 0; index < as.length; index++) {
    let element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(
        element.href
          .split(`/spotify_clone/songs/${folder_name}/`)[1]
          .replaceAll("%20", " ")
          .replace(".mp3", "")
      );
      // songs_full.push(element.href);
    }
  }
  // store the trimed values in songs array
  return songs;
}

const playMusic = (songs, index) => {
  //handling bounds
  if (index < 0) {
    // Handling lower bound
    current_song_index = songs.length - 1;
  } else if (index >= songs.length) {
    // Handling upper bound
    current_song_index = 0;
  } else {
    current_song_index = index; // Set to the specified index if in bounds
  }

  let the_link =
    `/spotify_clone/songs/${folder_name}/${songs[index].replaceAll(
      " ",
      "%20"
    )}` + ".mp3";

  current_song.src = the_link;
  current_song.play();

  play.src = "assets/pause.svg";

  let parts = songs[index].split("-");
  let title = parts[0] ? parts[0].trim() : "Unknown Title";
  let artist = parts[1] ? parts[1].trim() : "Mystery Guy";
  document.querySelector(".songinfo").innerHTML = `${title} - ${artist}`;
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
  //for the initial default song
  current_song.addEventListener("loadedmetadata", () => {
    const total_duration = formatTime(current_song.duration);
    document.querySelector(".songtime").innerHTML = `00:00 / ${total_duration}`;
  });
};

//convert seconds to minutes in proper format
function formatTime(seconds) {
  // Calculate the number of minutes by dividing the total seconds by 60 and rounding down
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);

  // Calculate the remaining seconds after minutes by using the modulo operator
  const secs = Math.floor(seconds % 60);

  // Return the formatted time as 'minutes:seconds'.
  // If seconds are less than 10, add a leading '0' for proper formatting (e.g., '1:09' instead of '1:9').
  return `${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}
async function pop_songs(songs) {
  let songul = document.body
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songul.innerHTML = ""; // Clear existing songs

  for (const song of songs) {
    let parts = song.split("-");
    let title = parts[0] ? parts[0].trim() : "Unknown Title";
    let artist = parts[1] ? parts[1].trim() : "Mystery guy";
    songul.innerHTML =
      songul.innerHTML +
      `
    

      <li>
              <img class="invert" src="./assets/music.svg" alt="" />
              <div class="info">
              <span class="dnone">${song}</span>
                <div>${title}</div>
                <div>${artist}</div>
              </div>
              <div class="playnow">
                <span>Play Now</span>
                <img src="assets/playlistplay.svg" alt="" class="invert playlist_play" />
              </div>
            </li>`;
  }


}

async function pop_playlists(
  og_playlist,
  playlists,
  image_url,
  playlist_description
) {
  console.log(playlists);

  //populating the albums
  let cardContainer = document.body.querySelector(".cardContainer");

  for (let index = 0; index < playlists.length; index++) {
    url_to_playlist = image_url[index].substring(
      0,
      image_url[index].lastIndexOf("/")
    );
    let pfolder_name = url_to_playlist.substring(
      url_to_playlist.lastIndexOf("/") + 1
    );
    cardContainer.innerHTML =
      cardContainer.innerHTML +
      `<div class="card playme" data-slocation="${pfolder_name}">
      <div class="play">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
      >
        <circle cx="12" cy="12" r="12" fill="#1DB954" />
        <path
          d="M9.5,7.5 L16.5,12 L9.5,16.5 Z"
          fill="none"
          stroke="#000000"
          stroke-width="1.5"
          stroke-linejoin="round"
          stroke-linecap="round"
        />
      </svg>
      </div>
      <img
      src="${image_url[index]}"
      alt=""
      />
      <div class="playlist_details">
      <h2>${playlists[index]}</h2>
      <p>${playlist_description[index]}</p>
      </div>
      </div>`;
  }
  //add an event listener on play on card
  document.body
    .querySelector(".cardContainer")
    .addEventListener("click", async (e) => {
      if (e.target.closest(".play")) {
        // Check if the clicked element is inside a .play element
        const playElement = e.target.closest(".play");
        folder_name = playElement.parentElement.getAttribute("data-slocation");
        current_playlist = folder_name
          .replaceAll("%20", " ")
          .replaceAll("_", " ")
          .replace(/.$/, "")
          .split("-")[0];
        let songs = await getSongs(folder_name);
        await pop_songs(songs);

        Array.from(
          document.querySelector(".songList").getElementsByTagName("li")
        ).forEach((e, index) => {
          e.querySelector(".playlist_play").addEventListener(
            "click",
            (event) => {
              playMusic(songs, index);
            }
          );
        });
      }
    });
  const isMobile = window.matchMedia("(max-width: 500px)").matches;
  const isTab = window.matchMedia("(max-width: 1500px)").matches;
  if (isMobile || isTab) {
    document.body.querySelectorAll(".card").forEach((element) => {
      element.addEventListener("click", async (e) => {
        if (e.target.closest(".card")) {
          folder_name = e.target
            .closest(".card")
            .getAttribute("data-slocation");
          current_playlist = folder_name
            .replaceAll("%20", " ")
            .replaceAll("_", " ")
            .replace(/.$/, "")
            .split("-")[0];
          let songs = await getSongs(folder_name);
          await pop_songs(songs);

          Array.from(
            document.querySelector(".songList").getElementsByTagName("li")
          ).forEach((e, index) => {
            e.querySelector(".playlist_play").addEventListener(
              "click",
              (event) => {
                playMusic(songs, index);
              }
            );
          });
          document.querySelector(".left").style.left = "0%";
        } else {
          console.log("not");
        }
      });
    });
  }
}
async function main() {
  // get the list of all songs
  let songs = await getSongs(folder_name);
  let payload = await getPlaylists();
  let og_playlist = payload[0];
  let playlists = payload[1];
  let image_url = payload[2];
  let playlist_description = payload[3];
  await pop_playlists(og_playlist, playlists, image_url, playlist_description);

  //populating the songs
  await pop_songs(songs);

  // add event listener to each song in the playlist
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e, index) => {
    e.querySelector(".playlist_play").addEventListener("click", (event) => {
      // console.log(e.querySelector(".dnone").innerHTML);
      // console.log(index);
      playMusic(songs, index);
    });
  });

  // Attach event listener to play
  play.addEventListener("click", () => {
    if (current_song.paused) {
      play.src = "assets/pause.svg";

      current_song.play();
    } else {
      current_song.pause();
      play.src = "assets/play.svg";
    }
  });

  // add event listener to previous track
  previous.addEventListener("click", () => {
    if (current_song_index > 0) {
      current_song_index -= 1; // Go to the previous song
    } else {
      current_song_index = songs.length - 1; // Wrap to the last song if at the first song
    }
    playMusic(songs, current_song_index);
  });

  // add event listener to next track
  next.addEventListener("click", () => {
    if (current_song_index < songs.length - 1) {
      current_song_index += 1; // Go to the previous song
    } else {
      current_song_index = 0; // Wrap to the last song if at the first song
    }
    playMusic(songs, current_song_index);
  });

  //listen for time update
  current_song.addEventListener("timeupdate", () => {
    const currentTime = formatTime(current_song.currentTime);
    const total_duration = formatTime(current_song.duration);
    document.querySelector(
      ".songtime"
    ).innerHTML = `${currentTime}/${total_duration}`;
    document.querySelector(".circle").style.left =
      (current_song.currentTime / current_song.duration) * 100 + "%";
  });

  //add an event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    console.log(e.target.getBoundingClientRect().width, e.offsetX);
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    // figure out why the below math works
    current_song.currentTime = (current_song.duration * percent) / 100;
  });

  //hamburger
  document.querySelector(".hamburger").addEventListener("click", (e) => {
    document.querySelector(".left").style.left = "0%";
  });

  //adding responsiveness
  document.querySelector(".close_button").addEventListener("click", (e) => {
    document.querySelector(".left").style.left = "-120%";
  });

  //dummy for signup

  document.querySelectorAll(".arrow_c").forEach((element) => {
    element.addEventListener("click", (e) => {
      alert("This is a Single Page App ");
    });
  });

  //dummy for signup
  document.querySelectorAll(".signuplogin").forEach((element) => {
    element.addEventListener("click", (e) => {
      alert("This is a Single Page App");
    });
  });

  //add event listener for range
  // Correct the class name and selection
  document.querySelector(".vol_range").addEventListener("change", (e) => {
    current_song.volume = parseInt(e.target.value) / 100;
  });

  // add functionality to control the music using the keyboard
  document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      event.preventDefault();
      if (current_song.paused) {
        current_song.play();
        play.src = "assets/pause.svg";
      } else {
        current_song.pause();
        play.src = "assets/play.svg";
      }
    }
  });
}

main();
