module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: {
        args: false,
        references: {
          model: 'Users',
          key: 'id',
          as: 'rater'
        }
      }
    },
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: {
        args: false,
        references: {
          model: 'Articles',
          key: 'id',
          as: 'ratedArticle'
        }
      }
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  Rating.associate = models => {
    Rating.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'rater',
      onDelete: 'cascade'
    });

    Rating.belongsTo(models.Article, {
      foreignKey: 'articleId',
      as: 'ratedArticle',
      onDelete: 'cascade'
    });
  };
  return Rating;
};
