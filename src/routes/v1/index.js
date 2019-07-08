import auth from './auth.route';
import users from './user.route';
import socialAuth from './social.route';

export default app => {
  app.use('/api/v1/auth/', socialAuth);
  app.use('/api/v1/users', auth);
  app.use('/api/v1/users/', users);
};
