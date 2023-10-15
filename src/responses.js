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

const getAllSongs = (request, response, playlist = null) => {
  const obj = playlist ? { songs: songs[playlist] } : { songs };
  return respondJSON(request, response, 200, obj);
};

const getAllPlaylists = (request, response) => {
  const obj = { playlists: [] };
  for (const [key, value] of Object.entries(songs)) {
    obj.playlists.push(key);
  }
  return respondJSON(request, response, 200, obj.playlists);
};

// body - the request itself
const updatePlaylist = (request, response, body) => {
  // assume missing fields
  const obj = {
    message: `${body.title} by ${body.artist} has been successfully added to your playlist.`,
  };

  if (!body.title || !body.artist || !body.link) {
    obj.message = 'All fields required';
    obj.id = 'missingParams';
    return respondJSON(request, response, 400, obj);
  }

  if (body.playlistName == '') {
    obj.message = 'Invalid Playlist <br>Please create new playlist';
    obj.id = 'invalidPlaylist';
    return respondJSON(request, response, 400, obj);
  }

  let statusCode = 204; // update don't create new one
  let playlistName;

  if (!body.playlistName) {
    playlistName = 'placeholder';
  } else {
    playlistName = body.playlistName;
  }

  // create a new playlist if it doesn't exist
  if (!songs[playlistName]) {
    statusCode = 201;
    songs[playlistName] = {};
  }

  // create new song if it doesn't exist
  if (!songs[playlistName][body.title]) {
    statusCode = 201;
    songs[playlistName][body.title] = {};
  }

  // update song
  const currentSong = songs[playlistName][body.title];
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
  getAllPlaylists,
  updatePlaylist,
  notFound,
};
