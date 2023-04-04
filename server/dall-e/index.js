// import { getLyrics, getSong } from 'genius-lyrics-api';
// // const getLyrics = require("genius-lyrics-api");
// // const getSong = require("genius-lyrics-api");
// const options = {
// 	apiKey: 'q_IlWsdCAon3oOGsyRD9NVsGcs5EGCCWHGiModJTavI4QqwbrEaLrJeanIKWBZ3s',
// 	title: 'Bad Liar',
// 	artist: 'Imagine Dragons',
// 	optimizeQuery: true
// };

// getLyrics(options).then((lyrics) => console.log(lyrics));


// lyrics end

const { Configuration, OpenAIApi } = require("openai");
const axios = require('axios')

require('dotenv').config()
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/image", async (req, res) => {
    // Get the prompt from the request
    const { name,artist } = req.body;

    let parsed,parsedSliced;

    await axios.post("http://localhost:5500/lyrics",{
        name:name,
        artist:artist
    })
    .then((res) => {
        parsed = JSON.stringify(res.data);
        parsedSliced = parsed.slice(1,500);
        console.log(parsedSliced);
    })
    .catch((err) => {
        console.log(err);
    })

    // Generate image from prompt
    const response = await openai.createImage({
        prompt: parsedSliced,
        n: 1,
        size: "1024x1024",
    });
    // Send back image url
    res.send(response.data.data[0].url);
    
});

app.post("/image/audio",async(req,res) => {
    const {prompt} = req.body;

    const response = await openai.createImage({
        prompt: prompt,
        n:1,
        size:"1024x1024",
    });

    res.send(response.data.data[0].url);
})


const port = 8080;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});