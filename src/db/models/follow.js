export default (sequelize, DataTypes) => {
  const Follow = sequelize.define('Follow', {
    userId: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Please provide a userId'
      },
      validate: {
        isInt: {
          args: true,
          msg: 'Please provide a user'
        }
      }
    },
    friendUserId: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Please provide a userId'
      },
      validate: {
        isInt: {
          args: true,
          msg: 'Please provide a user'
        }
      }
    },
    isFollowing: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: true
    }
  });
  Follow.associate = models => {
    Follow.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'userFollowers'
    });

    Follow.belongsTo(models.User, {
      foreignKey: 'friendUserId',
      as: 'follower'
    });
  };

  return Follow;
};
