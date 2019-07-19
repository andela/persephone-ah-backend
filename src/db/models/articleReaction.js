module.exports = (sequelize, DataTypes) => {
  const ArticleReaction = sequelize.define('ArticleReaction', {
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
    isLiked: {
      type: DataTypes.BOOLEAN,
      allowNull: {
        args: false
      },
      defaultValue: true
    }
  });
  ArticleReaction.associate = models => {
    // associations can be defined here
    ArticleReaction.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'liker'
    });
    ArticleReaction.belongsTo(models.Article, {
      foreignKey: 'articleId',
      as: 'articleLiked'
    });
  };
  return ArticleReaction;
};
