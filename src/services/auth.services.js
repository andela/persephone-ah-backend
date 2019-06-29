import { getToken } from '../helpers/jwt.helper';
import model from '../db/models';
const { User } = model;

const signUpService =  async body => {
    const { firstName, lastName, email, password } = body;
    const result = await User.create({
        firstName,
        lastName,
        password,
        email,
    });    
    const user = {
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        img: result.image,
        token: getToken(result),
    }
    return { user };
}

export default {
    signUpService
}
