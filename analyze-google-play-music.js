
const fs = require('fs');
const path = require('path');

const googlePlayMusic = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'GooglePlayMusic.json'), 'UTF-8'));

const artists = {};
const songs = {};

for (let block of googlePlayMusic) {
  for (let song of block.songs) {
    if (artists[song.artist]) {
      artists[song.artist].count++;
    } else {
      artists[song.artist] = { count: 1 };
    }

    if (songs[`${song.name} - ${song.artist}`]) {
      songs[`${song.name} - ${song.artist}`].count++;
    } else {
      songs[`${song.name} - ${song.artist}`] = { count: 1};
    }
  }
}

const artistsArray = [];
for (let artist in artists) {
  artistsArray.push({name: artist, count: artists[artist].count});
}

const songsArray = [];
for (let song in songs) {
  songsArray.push({name: song, count: songs[song].count});
}

artistsArray.sort((a, b) => b.count - a.count);
songsArray.sort((a, b) => b.count - a.count);

console.log('Top 10 Artists');
console.log('------------------------------------------');
for (let i = 0; i < 10; i++) {
  console.log(`${i + 1}: ${artistsArray[i].name}${'\t'.repeat(5 - artistsArray[i].name.length / 6)}Count: ${artistsArray[i].count}`);
}

console.log('');
console.log('Top 10 Songs');
console.log('-------------------------------------------------------------------------');
for (let i = 0; i < 10; i++) {
  console.log(`${i + 1}: ${songsArray[i].name}${'\t'.repeat(9 - (songsArray[i].name.length * 1.22799) / 9)}Count: ${songsArray[i].count}`);
}

