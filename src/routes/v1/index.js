import authentication from './auth.route';
import user from './user.route';

export default app => {
  app.use('/api/v1/users', authentication);
  app.use('/api/v1/users', user);
};
