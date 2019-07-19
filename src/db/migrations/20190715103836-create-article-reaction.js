module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ArticleReactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
          as: 'liker'
        }
      },
      articleId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Articles',
          key: 'id',
          as: 'article'
        },
        allowNull: {
          args: true
        }
      },
      isLiked: {
        type: Sequelize.BOOLEAN,
        allowNull: {
          args: false
        },
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable('ArticleReactions');
  }
};
