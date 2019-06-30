import { getToken } from '../helpers/jwt.helper';
import model from '../db/models';
const { User } = model;

const signUpService = async body => {
  const { firstName, lastName, email, password } = body;
  const result = await User.create({
    firstName,
    lastName,
    password,
    email
  });
  const user = {
    firstName: result.firstName,
    lastName: result.lastName,
    email: result.email,
    img: result.image,
    token: getToken(result)
  };
  return { user };
};

const loginService = async body => {
  const { email, password } = body;
  const result = await User.findOne({
    where: { email }
  });
  if (result && result.validatePassword(password)) {
    const { firstName, lastName } = result;
    const token = await getToken(result);
    const user = {
      firstName,
      lastName,
      email,
      token
    };
    return { user };
  }
};

export default {
  signUpService,
  loginService
};
