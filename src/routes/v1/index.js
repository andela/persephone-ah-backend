import auth from './auth.route';
import user from './user.route';

export default app => {
  app.use('/api/v1/users', auth);
  app.use('/api/v1/users', user);
};
