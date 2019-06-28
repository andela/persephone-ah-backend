import model from '../db/models';
const { User } = model;

const signUp = async (request, response) => {
	const { firstName, lastName, password, email } = request.body;

	const user = await User.create({
		firstName,
		lastName,
		password,
		email,
	});

	return response.status(201).json(user);
};

export default { signUp };
