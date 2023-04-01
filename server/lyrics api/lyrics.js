import { getLyrics, getSong } from 'genius-lyrics-api';
// const getLyrics = require("genius-lyrics-api");
// const getSong = require("genius-lyrics-api");
const options = {
	apiKey: 'q_IlWsdCAon3oOGsyRD9NVsGcs5EGCCWHGiModJTavI4QqwbrEaLrJeanIKWBZ3s',
	title: 'Bad Liar',
	artist: 'Imagine Dragons',
	optimizeQuery: true
};

getLyrics(options).then((lyrics) => console.log(lyrics));