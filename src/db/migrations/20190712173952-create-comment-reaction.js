module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('CommentReactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: {
          args: false,
          references: {
            models: 'Users',
            key: 'id',
            as: 'liker'
          }
        }
      },
      email: {
        type: Sequelize.STRING,
        allowNull: {
          args: false
        }
      },
      commentId: {
        type: Sequelize.INTEGER,
        allowNull: {
          args: false,
          references: {
            models: 'Comments',
            key: 'id',
            as: 'liked'
          }
        }
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
    return queryInterface.dropTable('CommentReactions');
  }
};
