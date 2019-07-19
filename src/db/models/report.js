export default (sequelize, DataTypes) => {
  const Report = sequelize.define(
    'Report',
    {
      reason: {
        type: DataTypes.STRING,
        allowNull: {
          args: false,
          msg: 'Please enter a Report'
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
            as: 'reporter'
          }
        }
      }
    },
    { paranoid: true }
  );
  Report.associate = models => {
    Report.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'reporter'
    });

    Report.belongsTo(models.Article, {
      foreignKey: 'articleId',
      as: 'article'
    });
  };

  return Report;
};
