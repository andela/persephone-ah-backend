const express = require('express');
const bodyParser = require('body-parser');

// Create global app object
const app = express();

// Normal express config defaults
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  return res.send({ status: 200, message: `Welcome to Author's Haven` });
});

const PORT = process.env.PORT || 3000;

// finally, let's start our server...
app.listen(PORT, function() {
  console.log(`Listening on port: ${PORT}`);
});

module.exports = { app };
