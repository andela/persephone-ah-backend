module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    'Tag',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: {
          args: true
        }
      }
    },
    {}
  );
  Tag.associate = models => {
    // defines association between articles and tags table
    Tag.belongsToMany(models.Article, {
      as: 'Tagged',
      through: 'ArticleTags'
    });
  };
  return Tag;
};
