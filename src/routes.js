const { Router } = require('express');
const { startStream, stopStream } = require('./stream');
const { handleGeneratePort } = require('./utils')
const cluster = require('cluster');
const router = Router()

router.get('/', (req, res) => {
    res.send(`Welcome to Server Node RTSP`)
})

router.post('/stream', (req, res) => {
    try {
        const { streamUrl } = req.body
        const { options } = startStream(streamUrl, handleGeneratePort());
        res.json({ port: options.wsPort });
    } catch (e) {
        res.send(`ERROR: ${e}`);
    }
})

router.get('/stop', (req, res) => {
    try {
        stopStream();
        res.send("SUCCESS");
    } catch (e) {
        res.send(`ERROR: ${e}`);
    }
})

router.get('/index.html', (req, res) => {
    res.sendFile(__dirname + '/html/index.html');
})

router.get('/jsmpeg', (req, res) => {
    res.sendFile(__dirname + '/html/jsmpeg.min.js');
})

module.exports = router;