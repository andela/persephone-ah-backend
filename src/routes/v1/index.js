import auth from './auth.routes';

export default app => {
    app.use('/api/v1/users', auth);
};