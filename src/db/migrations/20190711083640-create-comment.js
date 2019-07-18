module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
          as: 'authorComment'
        }
      },
      articleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Articles',
          key: 'id',
          as: 'articleComment'
        }
      },
      slug: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      body: {
        type: Sequelize.JSON,
        allowNull: false
      },
      highlightedText: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      isEdited: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        paranoid: true
      }
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable('Comments');
  }
};
