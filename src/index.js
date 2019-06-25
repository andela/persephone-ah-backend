import express from 'express';
import bodyParser from 'body-parser';

// Create global app object
const app = express();

// Normal express config defaults
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (request, response) => {
  return response.send({ status: 200, message: `Welcome to Author's Haven` });
});

const PORT = process.env.PORT || 3000;

// finally, let's start our server...
app.listen(PORT, function() {
  console.log(`Listening on port: ${PORT}`);
});

export default app;
