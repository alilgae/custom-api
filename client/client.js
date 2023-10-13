const handleResponse = (response, method) => {
    const content = document.querySelector("#content");
    //switch statement for each message type
    //for a head request, this is all we need 
    switch(response.status) {
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

    //if we have a body to parse
    if(method !== 'head' && response.status !== 204){
      //display actual data we're getting
      response.json().then(obj => { 
        if(obj.songs) {
          let playlist = "<ol>";
          for(const [key, value] of Object.entries(obj.songs)) {
            playlist += `<span class="song">
            <li>Title: ${value.title}</li><ul>
            <li>Artist: ${value.artist}</li>
            <li>Link: ${value.link}</li></ul></span>`;
          }
          playlist += "</ol>";
          content.innerHTML += playlist;
        }        
        else if(obj.message) content.innerHTML += `<p>${obj.message}</p>`; 
        else content.innerHTML += `<p>${JSON.stringify(obj)}</p>`
      });
    }
  }

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
  const postData = async (form) => {
    //what method they have selected - type of request we're making
    const method = form.getAttribute("method");

    //what url they're looking for
    const url = form.getAttribute("action");


    const title = form.querySelector('#titleField').value;
    const artist = form.querySelector('#artistField').value;
    const songLink = form.querySelector('#linkField').value;

    const data = `title=${title}&artist=${artist}&link=${songLink}`;

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
  };

  window.onload = init;