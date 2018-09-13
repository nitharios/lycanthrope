const {
  client,
  FINGERPRINT,
  Helpers,
  Users
} = require('../workers/synapseAPI');

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
        return res.json({
          status: err.status,
          success: false,
          message: JSON.parse(err.response.text).error.en
        });
      }
      return res.json(usersRes);
      return res.json({
        status: usersRes.http_code,
        success: true,
        message: 'User list successfully returned',
        data: usersRes.users
      });
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
        return res.json({
          status: err.status,
          success: false,
          message: JSON.parse(err.response.text).error.en
        });
      }

      return res.json({
        status: 200,
        success: true,
        message: 'User creation successful'
      });
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
    (err, user) => {
      if (err) {
        return res.json({
          status: err.status,
          success: false,
          message: JSON.parse(err.response.text).error.en
        });
      }
      return res.json({
        status: 200,
        success: true,
        message: 'User successfully found',
        data: user.json
      });
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

  const {
    email,
    phoneNumber,
    name,
    entityType,
    entityScope
  } = req.body

  const documentPayload = {
    documents: [
      {
        email: email,
        phone_number: phoneNumber,
        ip: Helpers.getUserIP(),
        name: name,
        entity_type: entityType,
        entity_scope: entityScope
      }
    ]
  }

  Users.get(
    client,
    options,
    (err, user) => {
      if (err) {
        return res.json({
          status: err.status,
          success: false,
          message: JSON.parse(err.response.text).error.en
        });
      }
      
      user.addDocuments(
        documentPayload,
        (err, addDocRes) => {
          if (err) {
            return res.json({
              status: err.status,
              success: false,
              message: JSON.parse(err.response.text).error.en
            });
          }

          return res.json({
            status: 200,
            success: true,
            message: 'Document creation successful'
          });
        }
      )
    }
  )
})
.put((req, res) => {
  const options = {
    _id: req.params.userID,
    fingerprint: FINGERPRINT,
    ip_address: Helpers.getUserIP(),
    full_dehydrate: 'yes'
  }

  const {
    email,
    phoneNumber,
    name,
    entityType,
    entityScope
  } = req.body

  const userUpdatePayload = {
    documents: [
      {
        email: email,
        phone_number: phoneNumber,
        ip: Helpers.getUserIP(),
        name: name,
        entity_type: entityType,
        entity_scope: entityScope
      }
    ]
  }

  Users.get(
    client,
    options,
    (err, user) => {
      if (err) {
        return res.json({
          status: err.status,
          success: false,
          message: JSON.parse(err.response.text).error.en
        });
      }

      user.update(
        userUpdatePayload,
        (err, updateDocRes) => {
          if (err) {            
            return res.json({
              status: err.status,
              success: false,
              message: JSON.parse(err.response.text).error.en
            });
          }

          return res.json({
            status: 200,
            success: true,
            message: 'Document update successful'
          });
        }
      )
    }
  )
})

module.exports = router;