const http = require('http');
const url = require('url');
const query = require('querystring');
const html = require('./htmlHandler.js');
const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': html.getIndex,
  '/style.css': html.getCSS,
  '/getUsers': responseHandler.getUsers,
  notFound: responseHandler.notFound,
};

const parseBody = (request, response, callback) => {
  // storing the post request
  const body = [];

  // event handlers:

  request.on('error', (error) => {
    // print error to console
    console.dir(error);
    response.statusCode = 400;
    response.end();
  });

  // each time binary data is sent - guaranteed in order
  request.on('data', (data) => { body.push(data); });

  // when done sending data to us
  request.on('end', () => {
    // we've received binary data, parse it back to a single string
    const bodyString = Buffer.concat(body).toString();

    // we should have what user sends back
    // we know what the client should send back, so we don't have to check
    const bodyObj = query.parse(bodyString); // turns data into usable object

    callback(request, response, bodyObj); // .updateUsers
  });
};

const handlePost = (request, response, parsedURL) => {
  // addUser
  if (parsedURL.pathname === '/addUser') {
    parseBody(request, response, responseHandler.updateUsers);
  }
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url); // breaks into .pathname, .query, etc

  // this works since we only have one post request
  if (request.method === 'POST') {
    return handlePost(request, response, parsedUrl);
  }

  if (urlStruct[parsedUrl.pathname]) {
    return urlStruct[parsedUrl.pathname](request, response);
  }

  // default
  return urlStruct.notFound(request, response);
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});
