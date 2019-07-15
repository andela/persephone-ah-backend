import express from 'express';
import bodyParser from 'body-parser';
import swagger from 'swagger-ui-express';
import cors from 'cors';
import logger from 'morgan';
import passport from 'passport';
import session from 'express-session';
import swaggerConfig from '../swagger.json';
import Routes from './routes/v1';
import './config/passportStrategies';

// Create global App object
const app = express();

// Normal express config defaults
app.use(cors());
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));
app.use(logger('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
);
Routes(app);

app.use('/api-docs', swagger.serve, swagger.setup(swaggerConfig));

app.get('/', (request, response) => {
  return response.send({
    status: 200,
    message: `Welcome to Author's Haven`
  });
});

app.use((request, response, next) => {
  const error = new Error('You are trying to access a wrong Route');
  error.status = 404;
  next(error);
});

app.use((error, request, response, next) => {
  response.status(error.status || 500);
  response.json({
    status: error.status || 500,
    error: error.name,
    message: error.message
  });
});
const PORT = process.env.PORT || 3000;
// finally, let's start our server...
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

export default app;
