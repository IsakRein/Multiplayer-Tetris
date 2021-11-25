Server = require("./Server");
const prompt = require('prompt-sync')({sigint: true});

let port = prompt('Server port (default 8000): ');
let parsedPort = parseInt(port);
if (isNaN(parsedPort)) parsedPort = 8000;
const server = new Server(parsedPort);
