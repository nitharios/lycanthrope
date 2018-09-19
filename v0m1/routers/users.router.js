const {
  client,
  FINGERPRINT,
  Helpers,
  Users
} = require('../workers/synapseAPI');

const express = require('express');
const router = express.Router();

let usersDB = [];

router.route('/')
// GET all client's users
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
      
      if (usersDB.length === 0) {
        usersDB = usersRes.users.map((val, index) => {
          val.id = index;
          return val;
        })
      }
      
      return res.json({
        status: usersRes.http_code,
        success: true,
        message: 'User list successfully returned',
        data: usersRes.users
      });
    }
  )
})
// CREATE a new user
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

      // simulate user creation in client database
      addUserToDB(JSON.parse(JSON.stringify(usersRes.json)));
      
      return res.json({
        status: 200,
        success: true,
        message: 'User creation successful'
      });
    }
  )
})

router.route('/:userID')
// GET a user by ID 
.get((req, res) => {
  const options = {
    _id: usersDB[req.params.userID]._id,
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
// CREATE documents for user
.post((req, res) => {
  const options = {
    _id: usersDB[req.params.userID]._id,
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

  // GET request to validate user exists in client database
  // not necessary in full application if user is pre-validated
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

          updateUserInDB(addDocRes.json, req.params.userID);

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
// UPDATE documents for user
.put((req, res) => {  
  const options = {
    _id: usersDB[req.params.userID]._id,
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

  // not necessary in full application if user is pre-validated
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

          updateUserInDB(updateDocRes.json, req.params.userID);

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

/*************** Helper Functions  ******************/

// these functions simulate how a client may add or update a user in their own database
// implementation is dependent on client specifications
function addUserToDB(userData) {
  usersDB.push(userData);
  // simulate creation of index id
  usersDB[usersDB.length - 1].id = usersDB.length - 1;
}

function updateUserInDB(updatedUserData, index) {
  for (const key in updatedUserData) {
    if (usersDB[index].hasOwnProperty(updatedUserData)) {
      usersDB[index][key] = updatedUserData[key];
    }
  }
}

module.exports = router;