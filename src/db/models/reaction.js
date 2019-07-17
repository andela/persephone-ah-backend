module.exports = (sequelize, DataTypes) => {
  const Reaction = sequelize.define('Reaction', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: {
        args: true
      }
    },
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: {
        args: true
      }
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: {
        args: true
      }
    },
    isLiked: {
      type: DataTypes.BOOLEAN,
      allowNull: {
        args: false
      },
      defaultValue: true
    }
  });
  Reaction.associate = models => {
    // associations can be defined here
    Reaction.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'liker'
    });
    Reaction.belongsTo(models.Article, {
      foreignKey: 'articleId',
      as: 'articleLiked'
    });
  };
  return Reaction;
};
