import express from 'express';
import bodyParser from 'body-parser';
import swagger from 'swagger-ui-express';
import logger from 'morgan';
import swaggerConfig from '../swagger.json';
import Routes from './routes/v1/auth.routes';

// Create global App object
const app = express();

// Normal express config defaults
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use('/api/v1/auth', Routes)

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
