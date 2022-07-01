const Stream = require("node-rtsp-stream");
let streamVideo;

const streamOptions = {
    name: "Bunny",
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
}

const startStream = (url = "", port = 5050) => {
    return streamVideo = new Stream({
        ...streamOptions,
        ... { streamUrl: url, wsPort: port }
    });
}

const stopStream = () => {
    return streamVideo.stop();
}

module.exports = { startStream, stopStream };