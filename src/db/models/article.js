import sequelizeSlugify from 'sequelize-slugify';
import crypto from 'crypto';

export default (sequelize, DataTypes) => {
  const Article = sequelize.define(
    'Article',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: {
          args: false,
          msg: 'Please enter a title for this article'
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
      description: {
        type: DataTypes.STRING,
        allowNull: {
          args: true
        }
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: {
          args: false,
          msg: 'Please enter some content for this article'
        }
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: {
          args: true
        }
      },
      readTime: {
        type: DataTypes.TEXT,
        allowNull: {
          args: true
        }
      },
      viewsCount: {
        type: DataTypes.INTEGER,
        default: 0
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: {
          args: false
        }
      },
      isPublished: {
        type: DataTypes.BOOLEAN,
        default: false
      },
      publishedAt: {
        type: DataTypes.STRING,
        allowNull: {
          args: true
        }
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        default: false
      }
    },
    { paranoid: true },
    {
      getterMethods: {
        hash() {
          return crypto.randomBytes(16).toString('hex');
        }
      }
    }
  );
  sequelizeSlugify.slugifyModel(Article, {
    source: ['title'],
    suffixSource: ['hash']
  });

  Article.associate = models => {
    // associations can be defined here
    Article.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author',
      onDelete: 'CASCADE'
    });

    Article.hasMany(
      models.Rating,
      {
        foreignKey: 'articleId',
        as: 'ratedArticle'
      },
      { onDelete: 'cascade' }
    );
    Article.hasMany(models.Report, {
      foreignKey: 'articleId',
      as: 'articleReports'
    });
    Article.belongsToMany(models.User, {
      through: 'Bookmark',
      as: 'bookmarks',
      foreignKey: 'articleId',
      otherKey: 'userId'
    });
    // defines many-to-many association with the tags table
    Article.belongsToMany(models.Tag, {
      as: 'Tags',
      through: 'ArticleTags'
    });
  };
  return Article;
};
