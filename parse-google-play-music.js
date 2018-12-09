
const fs = require('fs');
const path = require('path');

const htmlparser = require("htmlparser2");

let dateBlocks = [];

let getDate = false;
let getSongName = false;
let getArtistName = false;
let getTime = false;

let songCount = false;
let artistCount = false;

const parser = new htmlparser.Parser({
  onopentag: (name, attribs) => {
    if (attribs.class) {
      switch(attribs.class) {
        case 't08 fp-date-block-date':
          getDate = true;
          break;
        case 'fp-display-block-description t10 g6':
          getArtistName = true;
          break;
        case 'fp-display-block-details t12 g6 layout-align-start-center layout-row':
          if (attribs['ng-click'] && attribs['ng-click'] === 'viewItemDetails({item: item})') {
            getTime = true;
          }
          break;
        default:
          break;
      }
    }
    
    if (attribs['ng-if'] && attribs['ng-if'] === '::(!item.getTitle().getUrl())') {
      getSongName = true;
    }
  },
  onclosetag: text => {
    if (getSongName) {
      getSongName = false;
      songCount = false;
    }

    if (getArtistName) {
      getArtistName = false;
      artistCount = false;
    }

    if (getTime) {
      getTime = false;
    }
  },
  ontext: text => {
    if (getDate) {
      dateBlocks.push({
        date: text,
        songs: []
      });
      getDate = false;
    }

    if (getSongName) {
      text = text.replace('\n            ', '').replace('\n          ', '');

      if (!songCount) {
        dateBlocks[dateBlocks.length - 1].songs.push({
          name: text
        });

        songCount = true;
      } else {
        dateBlocks[dateBlocks.length - 1].songs[dateBlocks[dateBlocks.length - 1].songs.length - 1].name += text;
      }
    }

    if (getArtistName) {
      text = text.replace('\n            ', '').replace('\n          ', '');

      if (!artistCount) {
        dateBlocks[dateBlocks.length - 1].songs[dateBlocks[dateBlocks.length - 1].songs.length - 1].artist = text;

        artistCount = true;
      } else {
        dateBlocks[dateBlocks.length - 1].songs[dateBlocks[dateBlocks.length - 1].songs.length - 1].artist += text;
      }
    }

    if (getTime) {
      if (dateBlocks[dateBlocks.length - 1].songs[dateBlocks[dateBlocks.length - 1].songs.length - 1]) {
        dateBlocks[dateBlocks.length - 1].songs[dateBlocks[dateBlocks.length - 1].songs.length - 1].time = text;
      }
    }
  },
  onend: () => {
    console.log('Done parsing');
    console.log(`Writing to ${path.resolve(__dirname, 'GooglePlayMusic.json')}`);
    fs.writeFileSync(path.resolve(__dirname, 'GooglePlayMusic.json'), JSON.stringify(dateBlocks), 'UTF-8');
    console.log('Finish writing');

    console.log('Converting to CSV');

    let googlePlayMusicCSV = 'name, artist, date, time\n';
    for (let block of dateBlocks) {
      for (let song of block.songs) {
        googlePlayMusicCSV += `"${song.name}","${song.artist}","${block.date}","${song.time}"\n`;
      }
    }

    console.log('Finish converting');
    console.log(`Writing to ${path.resolve(__dirname, 'GooglePlayMusic.csv')}`);
    fs.writeFileSync(path.resolve(__dirname, 'GooglePlayMusic.csv'), googlePlayMusicCSV, 'UTF-8');
    console.log('Finish writing');
  }
}, {
  decodeEntities: true
});

console.log(`Parsing ${path.resolve(__dirname, 'GooglePlayMusic.html')}`);
parser.write(fs.readFileSync(path.resolve(__dirname, 'GooglePlayMusic.html'), 'UTF-8'));
parser.end();

