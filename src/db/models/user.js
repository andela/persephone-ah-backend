export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Please enter your First Name'
      },
      validate: {
        isAlpha: {
          args: true,
          msg: 'Please enter a valid character'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Please enter your Last Name'
      },
      validate: {
        isAlpha: {
          args: true,
          msg: 'Please enter a valid character'
        }
      }
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isAlphanumeric: {
          args: true,
          msg: 'Please enter a valid character'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Please enter your email address'
      },
      unique: {
        args: true,
        msg: 'Email already exists'
      },
      validate: {
        isEmail: {
          args: true,
          msg: 'Please enter a valid email address'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Please enter a password'
      }
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    confirmEmail: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    confirmEmailCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isNotified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    passwordToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    socialAuth: {
      type: DataTypes.STRING,
      allowNull: true
    },
    roleType: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'author'
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    twitterHandle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    facebookHandle: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });
  User.associate = models => {
    // associations can be defined here
    User.hasMany(models.Follow, {
      foreignKey: 'userId',
      as: 'followers',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.Follow, {
      foreignKey: 'friendUserId',
      as: 'followersfriend',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.ArticleReaction, {
      foreignKey: 'userId',
      as: 'likes'
    });
    // associations can be defined here

    User.belongsToMany(models.Article, {
      through: 'Bookmark',
      as: 'bookmarks',
      foreignKey: 'userId',
      otherKey: 'articleId'
    });
    User.hasMany(
      models.Article,
      {
        foreignKey: 'userId',
        as: 'author'
      },
      { onDelete: 'cascade' }
    );
    User.hasMany(
      models.Rating,
      {
        foreignKey: 'userId',
        as: 'rater'
      },
      { onDelete: 'cascade' }
    );
  };
  return User;
};
