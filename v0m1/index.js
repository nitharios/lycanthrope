const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

const PORT = process.env.PORT || 8000;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use('/api', routes);
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
})