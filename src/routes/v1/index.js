import auth from './auth.route';
import users from './user.route';

export default app => {
  app.use(`${process.env.API_VERSION}/users`, auth);
  app.use(`${process.env.API_VERSION}/users/`, users);
};
