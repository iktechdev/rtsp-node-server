const express = require('express');
const app = express();
const Stream = require("node-rtsp-stream");
const cors = require('cors');

const PORT = 3001;
let streamVideo;

app.use(cors({
  origin: '*'
}), express.json());

app.listen(PORT, (err) => {
  if (err) throw err
  console.log(`> Ready on http://localhost:${PORT}`)
})

const startStream = (url = null) => {
  return streamVideo = new Stream({
    name: "Bunny",
    streamUrl: url,
    wsPort: 5050,
    ffmpegOptions: {
      "-f": "mpegts",
      "-codec:v": "mpeg1video",
      "-b:v": "1000k",
      "-stats": "",
      "-r": 25,
      "-bf": 0,
      "-codec:a": "mp2",
      "-ar": 44100,
      "-ac": 1,
      "-b:a": "128k",
      "-vf": "fps=30"
    },
  });
}

app.post('/', (req, res) => {
  try {
    const { streamUrl } = req.body
    startStream(streamUrl);
    res.send("SUCCESS");
  } catch (e) {
    res.send(`ERROR: ${e}`);
  }
})

app.get('/stop', (req, res) => {
  try {
    streamVideo.stop();
    res.send("SUCCESS");
  } catch (e) {
    res.send(`ERROR: ${e}`);
  }
})

app.get('/index.html', (req, res) => {
  res.sendFile(__dirname + '/html/index.html');
})

app.get('/jsmpeg', (req, res) => {
  res.sendFile(__dirname + '/html/jsmpeg.min.js');
})