module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'facebookHandle', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },
  down: queryInterface => {
    return queryInterface.removeColumn('Users', 'facebookHandle');
  }
};
