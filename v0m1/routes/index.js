require('dotenv').config();

const express = require('express');
const router = express.Router();

const Users = require('./Users');

const routes = {
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