import { getLyrics, getSong } from 'genius-lyrics-api';
import express from 'express';
import cors from 'cors';
// const bodyParser = require("body-parser");
import bodyParser from 'body-parser';


// const options = {
// 	apiKey: 'q_IlWsdCAon3oOGsyRD9NVsGcs5EGCCWHGiModJTavI4QqwbrEaLrJeanIKWBZ3s',
// 	title: 'Bad Liar',
// 	artist: 'Imagine Dragons',
// 	optimizeQuery: true
// };

let lyricsReceived;

// getLyrics(options).then((lyrics) => lyricsReceived = lyrics);

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/lyrics", async (req, res) => {
	const {name,artist} = req.body;

	const options = {
		apiKey: 'q_IlWsdCAon3oOGsyRD9NVsGcs5EGCCWHGiModJTavI4QqwbrEaLrJeanIKWBZ3s',
		title: name,
		artist: artist,
		optimizeQuery: true
	};

	getLyrics(options).then((lyrics) => lyricsReceived = lyrics);
	console.log(lyricsReceived);
	res.send(lyricsReceived);
})

app.listen(5000, ()=>{
	console.log("Listening on port 5000");
})