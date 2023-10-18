const createDropdown = (dropdownFields, dropdown) => {
  if(!dropdownFields) dropdownFields = `<option value="">No Playlists Yet</option>`;
  document.querySelector(dropdown).innerHTML = "";
  document.querySelector(dropdown).innerHTML += dropdownFields;
}

const handleResponse = (response, method, url = null, dropdown = null) => {
  const content = document.querySelector("#content");
  //switch statement for each message type
  if(url !== '/getUserPlaylists'){
  switch (response.status) {
    case 200:
      //content.innerHTML = `<h3>Success</h3>`;
      break;
    case 201:
      content.innerHTML += `<h3>Song Uploaded</h3>`;
      break;
    case 204:
      content.innerHTML += '<h3>Song Updated</h3>';
      break;
    case 400:
      content.innerHTML += `<h3>Bad Request</h3>`;
      break;
    case 404:
      content.innerHTML += `<h3>Resource Not Found</h3>`;
      break;
    default:
      content.innerHTML += `Error code not implemented by client.`;
      break;
  }}

  //if we have a body to parse
  if (method !== 'head' && response.status !== 204) {
    //display actual data we're getting
    response.json().then(obj => {
      if(url === '/getUserPlaylists') {
        let dropdownOptions = "";
        for(const playlist of obj) {
          dropdownOptions += `<option value='${playlist}'>${playlist}</option>`;
        }
       return createDropdown(dropdownOptions, dropdown);
      }
      if (obj.songs) {
        const playlistName = document.querySelector("#getPlaylists").value;
        let playlistOutput = `<h3>Playlist: ${playlistName}</h3><ol>`;
        for (const [key, value] of Object.entries(obj.songs)) {
          playlistOutput += `<span class="song">
            <li>Title: ${value.title}</li><ul>
            <li>Artist: ${value.artist}</li>
            <li>Link: ${value.link}</li></ul></span>`;
        }
        playlistOutput += "</ol>";
        content.innerHTML += playlistOutput;
      }
      else if (obj.message) content.innerHTML += `<p>${obj.message}</p>`;
      
    });
  }
};

//async means await keyword is somewhere in this function
const requestData = async (playlistForm) => {
  //what method they have selected - type of request we're making
  const method = 'GET';

  //what url they're looking for
  const url = `${playlistForm.action}?playlistName=${document.querySelector("#getPlaylists").value}`;

  const response = await fetch(url, { method }); //we know data will be there since we're waiting for it

  handleResponse(response, method, playlistForm.action);
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

  handleResponse(response, method, url);
};

const getAllPlaylists = async (dropdown) => {
  const method = 'GET';

  //what url they're looking for
  const url = `/getUserPlaylists`;

  const response = await fetch(url, { method }); //we know data will be there since we're waiting for it

  handleResponse(response, method, url, dropdown);
}

const init = () => {
  //get form
  const playlistForm = document.querySelector("#playlistForm");
  const content = document.querySelector("#content");

  //on submit button press 
  playlistForm.addEventListener('submit', (e) => {
    e.preventDefault();
    content.innerHTML = "";

    //request handle
    requestData(playlistForm);

    return false;
  });

  //get form
  const songForm = document.querySelector("#songForm");

  //on submit button press 
  songForm.addEventListener('submit', (e) => {
    e.preventDefault();
    content.innerHTML = "";


    //request handle
    postData(songForm);

    getAllPlaylists("#getPlaylists");

    return false;
  });

  //display relevant fields for new/existing playlist 
  const newPlaylistButton = document.querySelector("#newPlaylist");
  const existingPlaylistButton = document.querySelector("#existingPlaylist");

  newPlaylistButton.addEventListener('change', (e) => {
    if (newPlaylistButton.checked) {
      const textField = ` <label for="playlistName">:</label>
                          <input id="nameField" type="text" name="playlistName" />`;
      document.querySelector("#newPlaylistName").innerHTML += textField;

      document.querySelector("#existingPlaylistDropdown").innerHTML = "";
    }
  });

  existingPlaylistButton.addEventListener('change', (e) => {
    if (existingPlaylistButton.checked) {
      document.querySelector("#newPlaylistName").innerHTML = "";

      document.querySelector("#existingPlaylistDropdown").innerHTML += `<label for="playlists">:</label> <select name="playlists" id="existingPlaylistsSelect"></select>`;
      getAllPlaylists("#existingPlaylistsSelect");
      
    }
  });

  getAllPlaylists("#getPlaylists");
};

window.onload = init;