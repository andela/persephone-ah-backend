import auth from './auth.route';

export default app => {
  app.use('/api/v1/users', auth);
};
