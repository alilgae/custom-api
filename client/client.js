const handleResponse = (response, method) => {
  const content = document.querySelector("#content");
  //switch statement for each message type
  //for a head request, this is all we need 
  switch (response.status) {
    case 200:
      content.innerHTML = `<b>Success</b>`;
      break;
    case 201:
      content.innerHTML = `<b>Song Uploaded</b>`;
      break;
    case 204:
      content.innerHTML = '<b>Song Updated</b>';
      break;
    case 400:
      content.innerHTML = `<b>Bad Request</b>`;
      break;
    case 404:
      content.innerHTML = `<b>Resource Not Found</b>`;
      break;
    default:
      content.innerHTML = `Error code not implemented by client.`;
      break;
  }

  const playlistName = document.querySelector("#getPlaylists").value;

  //if we have a body to parse
  if (method !== 'head' && response.status !== 204) {
    //display actual data we're getting
    response.json().then(obj => {
      if (obj.songs) { console.log(obj.songs);
        let playlist = "<ol>";
        for (const [key, value] of Object.entries(obj.songs[playlistName])) {
          playlist += `<span class="song">
            <li>Title: ${value.title}</li><ul>
            <li>Artist: ${value.artist}</li>
            <li>Link: ${value.link}</li></ul></span>`;
        }
        playlist += "</ol>";
        content.innerHTML += playlist;
      }
      else if (obj.message) content.innerHTML += `<p>${obj.message}</p>`;
      else content.innerHTML += `<p>${JSON.stringify(obj)}</p>`
    });
  }
};

//async means await keyword is somewhere in this function
const requestData = async (playlistForm) => {
  //what method they have selected - type of request we're making
  const method = 'GET';

  //what url they're looking for
  const url = '/getPlaylist';

  const response = await fetch(url, { method }); //we know data will be there since we're waiting for it

  handleResponse(response, method);
};

//async means await keyword is somewhere in this function
const postData = async (songForm) => {
  //what method they have selected - type of request we're making
  const method = songForm.getAttribute("method");

  //what url they're looking for
  const url = songForm.getAttribute("action");


  const title = songForm.querySelector('#titleField').value;
  const artist = songForm.querySelector('#artistField').value;
  const songLink = songForm.querySelector('#linkField').value;

  const playlist =
    document.querySelector("#nameField") ?
      document.querySelector("#nameField").value :
      document.querySelector("#existingPlaylistsSelect").value;

  const data = `title=${title}&artist=${artist}&link=${songLink}&playlistName=${playlist}`;

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: data,
  });

  //we know data will be there since we're waiting for it

  handleResponse(response, method);
};

const getAllPlaylists = () => {
  //dummy return value
  return `<option value="fall out boy">Fall Out Boy</option>`;
}

const init = () => {
  //get form
  const playlistForm = document.querySelector("#playlistForm");

  //on submit button press 
  playlistForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //request handle
    requestData(playlistForm);

    return false;
  });

  //get form
  const songForm = document.querySelector("#songForm");

  //on submit button press 
  songForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //request handle
    postData(songForm);

    return false;
  });

  //display relevant fields for new/existing playlist 
  const newPlaylistButton = document.querySelector("#newPlaylist");
  const existingPlaylistButton = document.querySelector("#existingPlaylist");

  newPlaylistButton.addEventListener('change', (e) => {
    if (newPlaylistButton.checked) {
      const textField = ` <label for="playlistName">Playlist Name: </label>
                          <input id="nameField" type="text" name="playlistName" />`;
      document.querySelector("#newPlaylistName").innerHTML += textField;

      document.querySelector("#existingPlaylistDropdown").innerHTML = "";
    }
  });

  existingPlaylistButton.addEventListener('change', (e) => {
    if (existingPlaylistButton.checked) {
      document.querySelector("#newPlaylistName").innerHTML = "";

      const dropdownFields = getAllPlaylists();
      const dropdown = `<label for="playlists">Existing Playlists:</label>

      <select name="playlists" id="existingPlaylistsSelect">
        ${dropdownFields}
      </select>`;
      document.querySelector("#existingPlaylistDropdown").innerHTML = dropdown;

    }
  })
};

window.onload = init;