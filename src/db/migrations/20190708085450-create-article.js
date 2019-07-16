module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Articles', {
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
          as: 'author'
        }
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      image: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      averageRating: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      numberOfRating: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      sumOfRating: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      likesCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      isPublished: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      publishedAt: {
        type: Sequelize.STRING,
        allowNull: true
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
      }
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable('articles');
  }
};
