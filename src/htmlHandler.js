const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../hosted/client.html`);
const css = fs.readFileSync(`${__dirname}/../hosted/style.css`);
const js = fs.readFileSync(`${__dirname}/../client/client.js`);

const respond = (request, response, content, type) => {
  const headers = {
    'Content-Type': type,
  };

  response.writeHead(200, headers);
  response.write(content);
  response.end();
};

const getIndex = (request, response) => { respond(request, response, index, 'text/html'); };
const getCSS = (request, response) => { respond(request, response, css, 'text/css'); };
const getJS = (request, response) => { respond(request, response, js, 'application/javascript'); };

module.exports = {
  getIndex, getCSS, getJS,
};
