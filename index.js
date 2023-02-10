const express = require("express");
const app = express();
const Stream = require("node-rtsp-stream");
const cors = require("cors");

const PORT = 3001;
const WS_PORT = 5050;
let streamVideo;

app.use(
  cors({
    origin: "*",
  }),
  express.json()
);

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${PORT}`);
});

const startStream = (url = null) => {
  return (streamVideo = new Stream({
    name: "Bunny",
    streamUrl: url,
    wsPort: WS_PORT,
    ffmpegOptions: {
      "-stats": "",
      "-r": 25,
      "-q": 4,
    },
  }));
};

app.post("/", (req, res) => {
  streamVideo?.stop();
  try {
    const { streamUrl } = req.body;
    startStream(streamUrl);
    res.send("SUCCESS");
  } catch (e) {
    res.send(`ERROR: ${e}`);
  }
});

app.get("/stop", (req, res) => {
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
