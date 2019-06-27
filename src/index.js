import express from 'express';
import bodyParser from 'body-parser';
import swagger from 'swagger-ui-express';
import swaggerConfig from '../swagger.json';

// Create global App object
const app = express();

// Normal express config defaults
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api-docs', swagger.serve, swagger.setup(swaggerConfig));

app.get('/', (request, response) => {
  return response.send({
    status: 200,
    message: `Welcome to Author's Haven`
  });
});

const PORT = process.env.PORT || 3000;

// finally, let's start our server...
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

export default app;
