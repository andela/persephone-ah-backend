module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'bio', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },
  down: queryInterface => {
    return queryInterface.removeColumn('Users', 'bio');
  }
};
