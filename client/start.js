const fs = require('fs');
const fileName = './src/settings.json';
const file = require(fileName);
const util = require('util');
const exec = util.promisify(require('child_process').exec);
    
const prompt = require('prompt-sync')({ sigint: true });

let serverIp = prompt('Server ip (default localhost): ');
if (serverIp === "") serverIp = "localhost";

let serverPort = parseInt(prompt('Server port (default 8000): '));
if (isNaN(serverPort)) serverPort = 8000;

file.serverIp = serverIp;
file.serverPort = serverPort;

fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
  if (err) return console.log(err);
  console.log(JSON.stringify(file));
  console.log('writing to ' + fileName);

  console.log('\nStarting client...');
});

async function startClient() {
  const { stdout, stderr } = await exec('npm start');
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);
}
startClient();
