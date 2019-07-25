module.exports = {
  up: (queryInterface, Sequelize) => {
    // Article belongsToMany Tag
    return queryInterface.createTable('ArticleTags', {
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      ArticleId: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      TagId: {
        type: Sequelize.INTEGER,
        primaryKey: true
      }
    });
  },

  down: queryInterface => {
    // remove table
    return queryInterface.dropTable('ArticleTags');
  }
};
