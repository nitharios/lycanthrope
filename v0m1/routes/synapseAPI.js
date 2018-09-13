const SynapsePay = require('synapsepay');
const {
  Clients,
  Helpers,
  Users
} = SynapsePay;

require('dotenv').config();

const {
  CLIENT_ID,
  CLIENT_SECRET,
  FINGERPRINT,
  API
} = process.env;

const client = new Clients(
  CLIENT_ID,
  CLIENT_SECRET,
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

  Users.get(
    client,
    options,
    (err, usersRes) => {
      if (err) {
        console.log('Users error', err);
        return res.json(err);
      }

      console.log('Users', usersRes)
      return res.json(usersRes);
    }
  )
})
.post((req, res) => {
  const payload = {
    logins: [
      {
        email: req.body.email,
        password: req.body.password,
        read_only: false
      }
    ],
    phone_numbers: req.body.phoneNumbers,
    legal_names: req.body.legalNames,
    extra: {
      note: req.body.note,
      supp_id: '',
      is_business: req.body.isBusiness
    }
  }

  Users.create(
    client,
    FINGERPRINT,
    Helpers.getUserIP(),
    payload,
    (err, usersRes) => {
      if (err) {
        return res.json(err);
      }

      return res.json(usersRes);
    }
  )
})

router.route('/:userID')
.get((req, res) => {
  const options = {
    _id: req.params.userID,
    fingerprint: FINGERPRINT,
    ip_address: Helpers.getUserIP(),
    full_dehydrate: 'yes'
  }

  Users.get(
    client,
    options,
    (err, usersRes) => {
      if (err) {
        return res.json(err);
      }

      return res.json(usersRes);
    }
  )
})
.post((req, res) => {
  const options = {
    _id: req.params.userID,
    fingerprint: FINGERPRINT,
    ip_address: Helpers.getUserIP(),
    full_dehydrate: 'yes'
  }

  const documentPayload = {
    documents: [
      {
        email: req.body.email,
        phone_number: req.body.phoneNumber,
        ip: Helpers.getUserIP(),
        name: req.body.name,
        entity_type: req.body.entityType,
        entity_scope: req.body.entityScope
      }
    ]
  }

  Users.get(
    client,
    options,
    (err, user) => {
      if (err) {
        return res.json(err);
      }
      
      user.addDocuments(
        documentPayload,
        (err, addDocRes) => {
          if (err) {
            return res.json(err);
          }
          return res.json(addDocRes);
        }
      )
    }
  )
})
.put((req, res) => {
  return res.json(req.body.documents);
  const options = {
    _id: req.params.userID,
    fingerprint: FINGERPRINT,
    ip_address: Helpers.getUserIP(),
    full_dehydrate: 'yes'
  }

  const userUpdatePayload = {
    documents: [
      req.body.documents
    ]
  }

  Users.get(
    client,
    options,
    (err, user) => {
      if (err) {
        return res.json(err);
      }

      user.update(
        userUpdatePayload,
        (err, updateDocRes) => {
          if (err) {
            return res.json(err);
          }

          return res.json(updateDocRes);
        }
      )
    }
  )
})

module.exports = router;