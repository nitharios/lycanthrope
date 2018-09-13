const express = require('express');
const router = express.Router();

const synapseAPI = require('./synapseAPI');

const routes = {
  nodes: {
    worker: synapseAPI
  },
  subnets: {
    worker: synapseAPI
  },
  transactions: {
    worker: synapseAPI
  },
  transcriptions: {
    worker: synapseAPI
  },
  users: {
    worker: synapseAPI
  },
}

// build routes
for (const key in routes) {
  router.use(`/${key}`, routes[key].worker)
}

module.exports = router;