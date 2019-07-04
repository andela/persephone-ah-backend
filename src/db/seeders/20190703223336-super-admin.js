const date = new Date();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

module.exports = {
  up: queryInterface => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
    return queryInterface.bulkInsert(
      'Users',
      [
        {
          firstName: 'Damilola',
          lastName: 'Adekoya',
          email: 'koya@gmail.com',
          password: bcrypt.hashSync('author40', 10),
          confirmEmailCode: crypto.randomBytes(16).toString('hex'),
          createdAt: date,
          updatedAt: date
        }
      ],
      {}
    );
  },

  down: queryInterface => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
    */
    return queryInterface.bulkDelete('Users', null, {});
  }
};
