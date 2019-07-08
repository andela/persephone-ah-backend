export default (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      body: {
        type: DataTypes.JSON,
        allowNull: {
          args: false,
          msg: 'Please enter a comment'
        }
      },
      articleId: {
        type: DataTypes.INTEGER,
        allowNull: {
          args: false,
          references: {
            model: 'Articles',
            key: 'id',
            as: 'article'
          }
        }
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: {
          args: false,
          references: {
            model: 'Users',
            key: 'id',
            as: 'author'
          }
        }
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      highlightedText: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    { paranoid: true }
  );
  Comment.associate = models => {
    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'userComment'
    });

    Comment.belongsTo(models.Article, {
      foreignKey: 'articleId',
      as: 'articleComment'
    });
  };

  return Comment;
};
