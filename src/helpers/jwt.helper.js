import jwt from 'jsonwebtoken';
const dotenv = require('dotenv');
dotenv.config();

export const getToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.SECRET,
        {
            expiresIn: '12h'
        }
    );
}