const SynapsePay = require('synapsepay');
const {
  Clients,
  Helpers,
  Users
} = SynapsePay;

const client = new Clients(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  false
)

const express = require('express');
const router = express.Router();

router.route('/')
.get((req, res) => {
  const options = {
    ip_address: Helpers.getUserIP(),
    page: '',
    per_page: '',
    query: ''
  }

  return Users.get(
    client,
    options,
    (err, res) => {
      if (err) {
        console.log('Users error', err);
        return;
      }

      console.log('Users', res)
      return res;
    }
  )
})