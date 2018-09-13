const express = require('express');
const routes = require('./routes');

const PORT = process.env.PORT || 8000;
const app = express();

app.use('/api', routes);
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
})