const express = require('express');
const cors = require('cors');
const cluster = require('cluster');
const { cpus } = require('os');
const routes = require('./routes');

const app = express();
const PORT = 3001;


if (cluster.isPrimary) {
  for (let i = 0; i < cpus().length; i++) {
    cluster.fork();
  }
} else {
  app.use(cors({
    origin: '*'
  }), express.json());

  app.use(routes)
  app.listen(PORT, () => console.log(`🔥 Server started at http://localhost:${PORT}`));
}

