const express = require('express');
const app = express();
const Stream = require("node-rtsp-stream");
const cors = require('cors');

const PORT = 3001;
let stream;

app.use(cors({
    origin: '*'
}), express.json());

app.listen(PORT, (err) => {
  if (err) throw err
  console.log(`> Ready on http://localhost:${PORT}`)
})

const startStream = (url = null) => {
  return new Stream({
    name: "Bunny",
    streamUrl: url,
    wsPort: 5050,
    ffmpegOptions: { // options ffmpeg flags
      "-f": "mpegts", // output file format.
      "-codec:v": "mpeg1video", // video codec
      "-b:v": "1000k", // video bit rate
      "-stats": "",
      "-r": 25, // frame rate
      "-bf": 0,
      // audio
      "-codec:a": "mp2", // audio codec
      "-ar": 44100, // sampling rate (in Hz)(in Hz)
      "-ac": 1, // number of audio channels
      "-b:a": "128k", // audio bit rate
      "-vf": "fps=30"
    },
  });
}

app.post('/', (req, res) => {
  try {
    const {streamUrl} =  req.body
    stream = startStream(streamUrl);
    res.send("SUCCESS");
  } catch (e) {
    res.send(`ERROR: ${e}`);
  }
}) 

app.get('/stop', (req, res) => {
  try {
    stream.kill();
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