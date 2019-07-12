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
      slug: {
        type: DataTypes.STRING,
        allowNull: {
          args: false
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
      averageRating: {
        type: DataTypes.FLOAT,
        default: 0
      },
      numberOfRating: {
        type: DataTypes.INTEGER,
        default: 0
      },
      sumOfRating: {
        type: DataTypes.INTEGER,
        default: 0
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
  };

  Article.associate = models => {
    // associations can be defined here
    Article.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author',
      onDelete: 'CASCADE'
    });

    Article.hasMany(models.Rating, {
      foreignKey: 'articleId',
      as: 'ratedArticle'
      // onDelete: 'CASCADE'
    });
  };
  return Article;
};
