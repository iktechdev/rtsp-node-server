const handleGeneratePort = () => {
    const port = Math.floor(Math.random() * 6553);

    if (port.toString().length < 4) {
        return port * 10
    }

    return port;
}

module.exports = { handleGeneratePort }