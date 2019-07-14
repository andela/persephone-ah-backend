module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      userName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true
      },
      confirmEmail: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      confirmEmailCode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      isNotified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      isPublished: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      passwordToken: {
        type: Sequelize.STRING,
        allowNull: true
      },
      socialAuth: {
        type: Sequelize.STRING,
        allowNull: true
      },
      roleType: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'author'
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      facebookHandle: {
        type: Sequelize.STRING,
        allowNull: true
      },
      twitterHandle: {
        type: Sequelize.STRING,
        allowNull: true
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
    return queryInterface.dropTable('Users');
  }
};
