import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: {
          args: false,
          msg: 'Please enter your First Name'
        }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: {
          args: false,
          msg: 'Please enter your Last Name'
        }
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: true
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
      isPublished: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
      }
    },
    {
      hooks: {
        // eslint-disable-next-line no-shadow
        afterValidate: User => {
          User.password = bcrypt.hashSync(User.password, 10);
          User.confirmEmailCode = crypto.randomBytes(16).toString('hex');
        }
      }
    }
  );

  return User;
};
