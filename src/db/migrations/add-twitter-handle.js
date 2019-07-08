module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'twitterHandle', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },
  down: queryInterface => {
    return queryInterface.removeColumn('Users', 'twitterHandle');
  }
};
