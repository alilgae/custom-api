const songs = {};

// respond with head and body
const respondJSON = (request, response, status, obj) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  if (request.method !== 'HEAD' || status !== 204) response.write(JSON.stringify(obj));
  response.end();
};

const getUsers = (request, response) => {
  // what we're sending back
  const obj = {
    songs,
  };

  return respondJSON(request, response, 200, obj);
};

const getAllSongs = (request, response, playlist = songs) => {
  const obj = {songs};
  return respondJSON(request, response, 200, obj);
};

// body - the request itself
const updateUsers = (request, response, body) => {
  // assume missing fields
  const obj = {
    message: 'Created Successfully',
  };

  if (!body.title || !body.artist || !body.link) {
    obj.message = 'All fields required';
    obj.id = 'missingParams';
    return respondJSON(request, response, 400, obj);
  }

  let statusCode = 204; // successful update - no body sent

  // create new user if they don't exist
  if (!songs[body.title]) {
    statusCode = 201;
    songs[body.title] = {};
  }

  // update user
  const currentSong = songs[body.title];
  currentSong.title = body.title;
  currentSong.artist = body.artist;
  currentSong.link = body.link;

  return respondJSON(request, response, statusCode, obj);
};

const notFound = (request, response) => {
  // error message
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  return respondJSON(request, response, 404, responseJSON);
};

module.exports = {
  getAllSongs,
  updateUsers,
  notFound,
};
