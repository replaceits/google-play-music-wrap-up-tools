# google-play-music-wrap-up-tools

Tools for parsing and analyzing Google Play Music scrapped data

# Obtaining Data

Sadly, Google does not let you download a straight archive of your songs listened to.

Because of this we need a secondary method of obtaining our data.

You can find your listened to songs at [this link](https://myactivity.google.com/item?restrict=play_music). (https://myactivity.google.com/item?restrict=play_music)

We will need to scrape this page, you can go ahead and load all your data by using the following script in a browser console.

```js
$ = $;
const scrapeInterval = setInterval(() => {
    const loadMoreButton = $('#main-content > div.main-column-width > div.layout-align-center-stretch.layout-row > button');

    if (loadMoreButton) {
        loadMoreButton.click();
    } else {
        clearInterval(scrapeInterval);
        alert('Finished loading');
    }
}, 1000);
```

This script will keep pressing the load more button on the page until it has finished loading everything (an alert will tell you when this occurs).

This will take a while to run so be patient. (You can try decreasing the interval if you want to try to load it faster).

After the script as finished running you will need to save the HTML of the page. One of the easiest ways to do this is to simply select the root `<html>` node in the element inspector and pressing `Command+C` then going to a terminal and running

```bash
pbpaste > GooglePlayMusic.html
```

# Parse

Once you have your data you will need to place your `GooglePlayMusic.html` file into this projects root directory.

You can run either

`npm run parse`

or

`node parse-google-play-music.js`

which will show the following output

![
  music (master #) > node analyze-google-play.js
  Parsing /Users/replaceits/Documents/Programming/google-play-music-wrap-up-tools/GooglePlayMusic.html
  Done parsing
  Writing to /Users/replaceits/Documents/Programming/google-play-music-wrap-up-tools/GooglePlayMusic.json
  Finish writing
  Converting to CSV
  Finish converting
  Writing to /Users/replaceits/Documents/Programming/google-play-music-wrap-up-tools/GooglePlayMusic.csv
  Finish writing
  google-play-music-wrap-up-tools (master) >
](images/Parse.png)

This creates two files that you can use. One in JSON format (`GooglePlayMusic.json`) and one in CSV format (`GooglePlayMusic.csv`)

Example documents as shown

#### GooglePlayMusic.json
```json
[{
  "date": "August 25",
  "songs": [{
    "name": "Song name!",
    "artist": "Artist name!",
    "time": "12:25 PM"
  }]
}]
```

#### GooglePlayMusic.csv
```csv
name, artist, date, time
"Song name!", "Artists name!", "August 25", "12:25 PM"
```

| name       | artist        | date      | time     |
|------------|---------------|-----------|----------|
| Song name! | Artists name! | August 25 | 12:25 PM |


# Analyze

I have provided a simple tool to analyze your `GooglePlayMusic.json` file. This will output your top ten Artists, your top ten songs (along with your counts of each).

Run either

`npm run analyze`

or

`node analyze-google-play-music.js`

which will show the following output

![
  music (master #) > node parse-google-play.js
  Top 10 Artists
  1: Travis Scott			Count: 258
  2: McCafferty			Count: 231
  3: NAV				Count: 223
  4: Joji				Count: 185
  5: A L E X			Count: 185
  6: Posture & the Grizzly	Count: 184
  7: Juice WRLD			Count: 176
  8: Lil Uzi Vert			Count: 172
  9: Lil Skies			Count: 153
  10: Old Gray      Count: 151
  \n
  Top 10 Songs
  1: Kill Me - Posture & the Grizzly				Count: 53
  2: I Forgot to Take My Meds Today - Prince Daddy & the Hyena	Count: 49
  3: ***HIDDEN TRACK*** - Prince Daddy & The Hyena		Count: 36
  4: No Brains - Posture & the Grizzly				Count: 34
  5: Police / / You're Outta Here - sports.			Count: 33
  6: My Shit - A Boogie Wit da Hoodie				Count: 33
  7: Trailer Trash - McCafferty					Count: 30
  8: goosebumps - Travis Scott					Count: 30
  9: I'm A Bum - Prince Daddy & The Hyena				Count: 30
  10: Black & White - Juice WRLD					Count: 29
  google-play-music-wrap-up-tools (master) >
](images/Analyze.png)

Feel free to fork and have fun analyzing your own data!
