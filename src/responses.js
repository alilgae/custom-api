const users = {};

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
    users,
  };

  return respondJSON(request, response, 200, obj);
};

// body - the request itself
const updateUsers = (request, response, body) => {
  // assume missing fields
  const obj = {
    message: 'Created Successfully',
  };

  if (!body.name || !body.age) {
    obj.message = 'Name and Age are both required';
    obj.id = 'missingParams';
    return respondJSON(request, response, 400, obj);
  }

  let statusCode = 204; // successful update - no body sent

  // create new user if they don't exist
  if (!users[body.name]) {
    statusCode = 201;
    users[body.name] = {};
  }

  // update user
  const currentUser = users[body.name];
  currentUser.name = body.name;
  currentUser.age = body.age;

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
  getUsers,
  updateUsers,
  notFound,
};
