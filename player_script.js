// Get the hash of the url
const hash = window.location.hash
.substring(1)
.split('&')
.reduce(function (initial, item) {
  if (item) {
    var parts = item.split('=');
    initial[parts[0]] = decodeURIComponent(parts[1]);
  }
  return initial;
}, {});
window.location.hash = '';

// Set token
let _token = hash.access_token;

const authEndpoint = 'https://accounts.spotify.com/authorize';

// Replace with your app's client ID, redirect URI and desired scopes
const clientId = 'cc7cef71a3044d7a90dd4665106411d4';
const redirectUri = "https://sergeKashkin.github.io/Minify";
const scopes = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-modify-playback-state',
  'user-top-read',
  'playlist-modify-public',
  'playlist-modify-private'
];

// If there is no token, redirect to Spotify authorization
if (!_token) {
  window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
}

// A structure to save recommendations
var playlist = {
  topArtists: [],
  topTracks: [],
}

window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new Spotify.Player({
        name: 'Minify',
        getOAuthToken: cb => { cb(_token); }
      });

      // Error handling
      player.addListener('initialization_error', ({ message }) => { console.error(message); });
      player.addListener('authentication_error', ({ message }) => { console.error(message); });
      player.addListener('account_error', ({ message }) => { console.error(message); });
      player.addListener('playback_error', ({ message }) => { console.error(message); });

      // Playback status updates
      player.addListener('player_state_changed', state => { console.log(); });

      // Ready
      player.on('ready', data => {
        //console.log('Ready with Device ID', data.device_id);
        //data.device_id
        //calls play function that plays Say You Will. can be replaced with generated playlist
        play(data.device_id);
      });

      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      // Connect to the player!
      player.connect();

      getRecommendations('artists');
      getRecommendations('tracks');
      shuffle();
      //what happens when you click play/pause-->
      var pause_img = "pause.png";
      var play_img = "play.png";
      var is_playing = true;
      document.getElementById ("control").addEventListener ("click", toggle, false);
      //document.getElementById ("next").addEventListener ("click", next, false);


      function checkStatus() {
        player.getCurrentState().then(state => {
          if(!state) return;
          if(!state.track_window.next_tracks.length) enque();
        });
      }

      function next() {
        player.nextTrack();
      }

      function toggle() {

        player.togglePlay();

              if (is_playing)
                {is_playing=false;
                    control.src = play_img;}
                else
                {is_playing=true;
                    control.src = pause_img;
                  }

                       }
      // Playback status updates
    player.on('player_state_changed', state => {
    checkStatus();
    current_track_name.innerHTML = state.track_window.current_track.name;
    current_artist_name.innerHTML = state.track_window.current_track.artists[0].name;
    album_art.src = state.track_window.current_track.album.images[0].url;
    });



};

function play(device_id) {
  let song = playlist.topTracks[Math.floor(Math.random() * playlist.topTracks.length)];
  $.ajax({
   url: "https://api.spotify.com/v1/me/player/play?device_id=" + device_id,
   type: "PUT",
   data: '{"uris": ["'+song+'"]}',
   beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
  });
}

function shuffle() {
  fetch('https://api.spotify.com/v1/me/player/shuffle?state=true',{
  method: "PUT",
  headers: {
      'Accept':'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${_token}`
    }
  }).then(response => console.log());
}

//Fetch Recommendations
function getRecommendations(type) {
  fetch(`https://api.spotify.com/v1/me/top/${type}?limit=20`,
  {
    headers: {
      'Accept': "application/json",
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${_token}`
    }
  }).then(response => response.json())
  .then(data => parseTop(data.items,type));
}

function parseTop (data,type) {
  let list = data.map((rec) => {
    return rec.uri;
  });
  if (type === 'tracks')
    list = list.concat(["spotify:track:3FskQrDXcY24ur2fCvz35O","spotify:track:1ubnxi2jUIpXZIkmQlf7nK","spotify:track:2koS4fD3kzizdnzWzyrxyT","spotify:track:5pQ4H7k3NQaRQZICwp3pZV","spotify:track:6aw3yZkwazULegAv3Ns6DE"])
  eval(`playlist.top${type.charAt(0).toUpperCase() + type.slice(1)} = playlist.top${type.charAt(0).toUpperCase() + type.slice(1)}.concat(list)`);
  if (type === 'tracks')
    seeds();
}

function seeds () {
  let ids = playlist.topTracks.map(id => id.split(":")[2])
  let tracks = `${ids[Math.floor((Math.random() * ids.length))]}%2C${ids[Math.floor((Math.random() * ids.length))]}%2C${ids[Math.floor((Math.random() * ids.length))]}%2C${ids[Math.floor((Math.random() * ids.length))]}%2C${ids[Math.floor((Math.random() * ids.length))]}`
  fetch(`https://api.spotify.com/v1/recommendations?limit=100&market=US&seed_tracks=${tracks}&min_energy=0.4&min_popularity=50`,{
    method:"GET",
    headers: {
      'Accept': "application/json",
      'Content-Type':'application/json',
      'Authorization': `Bearer ${_token}`
    }
  }).then(response => response.json()).then(json =>  {
    let a = json.tracks.map(j => j.uri);
    playlist.topTracks = a;
  });
}

function popTrack() {
  return playlist.topTracks.pop();
}

function enque() {
  if(!playlist.topTracks.length) return;
  fetch(`https://api.spotify.com/v1/me/player/queue?uri=${popTrack()}`,{
    method: "POST",
    headers: {
      'Accept': "application/json",
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${_token}`
    }
  }).then(response => response.json())
  .then(data => console.log());
}

