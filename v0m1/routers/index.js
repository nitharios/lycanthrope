require('dotenv').config();

const express = require('express');
const router = express.Router();

const Users = require('./users.router');

const routes = {
  /* routes can be built out later on as project expands */
  // nodes: {
  //   worker: ''
  // },
  // subnets: {
  //   worker: ''
  // },
  // transactions: {
  //   worker: ''
  // },
  // transcriptions: {
  //   worker: ''
  // },
  users: {
    worker: Users
  },
}

// build routes
for (const key in routes) {
  router.use(`/${key}`, routes[key].worker)
}

module.exports = router;