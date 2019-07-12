module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('BlackLists', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userToken: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        default: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        default: Sequelize.NOW
      }
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable('BlackList');
  }
};
