const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function monitor() {
  const { stdout } = await exec(`ps aux | grep -E "Music"`);
  const musicApp = stdout.split('\n').find(app => app.includes('Music.app'));
  if (musicApp) {
    console.log(`Music launched itself, killing the process now... 💥`);
    await exec(`killall Music`);
    console.log(`Opening Spotify instead. Enjoy!`);
    await exec(`open /Applications/Spotify.app `);
  }
}

module.exports = monitor;
