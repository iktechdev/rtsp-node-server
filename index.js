const express = require('express');
const cors = require('cors');
const cluster = require('cluster');
const { cpus } = require('os');
const process = require('process');
const Stream = require("node-rtsp-stream");
const PORT = 3001;
let streamVideo;

const handleGeneratePort = () => {
  const port = Math.floor(Math.random() * 6553);

  if (port.toString().length < 4) {
    return port * 10
  }

  return port;
}

const streamOptions = {
  name: "Bunny",
  ffmpegOptions: {
    // "-f": "mpegts",
    // "-codec:v": "mpeg1video",
    // "-b:v": "1000k",
    "-stats": "",
    "-r": 25,
    // "-bf": 0,
    // "-codec:a": "mp2",
    // "-ar": 44100,
    // "-ac": 1,
    // "-b:a": "128k",
    // "-vf": "fps=30"
  },
}

const startStream = (url = "", port) => {
  return streamVideo = new Stream({
    ...streamOptions,
    ... { streamUrl: url, wsPort: port }
  });
}

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < cpus().length; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  const app = express();
  app.use(cors({
    origin: '*'
  }), express.json());

  app.post('/', (req, res) => {
    try {
      const { streamUrl } = req.body
      const { options } = startStream(streamUrl, handleGeneratePort());
      res.json({ port: options.wsPort });
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

  app.listen(PORT, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${PORT}`)
  })

  console.log(`Worker ${process.pid} started`);
}

