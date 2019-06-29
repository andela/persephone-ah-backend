import model from '../db/models';
const { User } = model;

const authService =  async body => {
    const { firstName, lastName, email, password } = body;
    const user = await User.create({
        firstName,
        lastName,
        password,
        email,
    });   
    return { status: 201,user };
}

export default {
    authService
}
