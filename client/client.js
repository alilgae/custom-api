const handleResponse = (response, method) => {
    const content = document.querySelector("#content");
    //switch statement for each message type
    //for a head request, this is all we need 
    switch(response.status) {
      case 200: 
        content.innerHTML = `<b>Success</b>`;
        break;
      case 201:
        content.innerHTML = `<b>Created</b>`;
        break;
      case 204: 
        content.innerHTML = '<b>Updated (No Content)</b>';
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
        if(obj.message) content.innerHTML += `<p>${obj.message}</p>`; 
        else content.innerHTML += `<p>${JSON.stringify(obj)}</p>`
      });
    }
  }

  //async means await keyword is somewhere in this function
  const requestData = async (userForm) => {
    //what method they have selected - type of request we're making
    const method = userForm.querySelector("#methodSelect").value;

    //what url they're looking for
    const url = userForm.querySelector("#urlField").value;

    const response = await fetch(url, { method }); //we know data will be there since we're waiting for it

    handleResponse(response, method);
  };

  //async means await keyword is somewhere in this function
  const postData = async (form) => {
    //what method they have selected - type of request we're making
    const method = form.getAttribute("method");

    //what url they're looking for
    const url = form.getAttribute("action");


    const name = form.querySelector('#nameField').value;
    const age = form.querySelector("#ageField").value;
    const data = `name=${name}&age=${age}`;

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
    const userForm = document.querySelector("#userForm");

    //on submit button press 
    userForm.addEventListener('submit', (e) => {
      e.preventDefault();

      //request handle
      requestData(userForm);

      return false;
    });

    //get form
    const nameForm = document.querySelector("#nameForm");

    //on submit button press 
    nameForm.addEventListener('submit', (e) => {
      e.preventDefault();

      //request handle
      postData(nameForm);

      return false;
    });
  };

  window.onload = init;