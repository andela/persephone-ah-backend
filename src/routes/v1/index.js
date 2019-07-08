import auth from './auth.route';
import users from './user.route';
import socialAuth from './social.route';

const { API_VERSION } = process.env;

export default app => {
  app.use(`${API_VERSION}/users`, auth);
  app.use(`${API_VERSION}/users`, users);
  app.use(`${API_VERSION}/auth`, socialAuth);
};
