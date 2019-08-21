module.exports = (sequelize, DataTypes) => {
  const CommentReaction = sequelize.define('CommentReaction', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: {
        args: false,
        references: {
          model: 'Users',
          key: 'id',
          as: 'liker'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: {
        args: false
      }
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: {
        args: false,
        references: {
          model: 'Comments',
          key: 'id',
          as: 'liked'
        }
      }
    }
  });
  CommentReaction.associate = models => {
    // associations can be defined here
    CommentReaction.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'liker'
    });

    CommentReaction.belongsTo(models.Comment, {
      foreignKey: 'commentId',
      as: 'liked'
    });
  };
  return CommentReaction;
};
