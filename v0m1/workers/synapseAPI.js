require('dotenv').config();

const SynapsePay = require('synapsepay');
const {
  Clients,
  Helpers,
  Nodes,
  Subnets,
  Transactions,
  Transcriptions,
  Users
} = SynapsePay;

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

module.exports = {
  client,
  Helpers,
  Nodes,
  Subnets,
  Transactions,
  Transcriptions,
  Users,
  FINGERPRINT
}
