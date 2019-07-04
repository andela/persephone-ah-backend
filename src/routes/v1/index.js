import auth from './auth.route';
import users from './user.routes';

export default app => {
  app.use('/api/v1/users', auth);
  app.use('/api/v1/users/', users);
};
