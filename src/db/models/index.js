import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import dotenv from 'dotenv';
import configJson from '../config/config';

dotenv.config();
/* istanbul ignore next */
const basename = path.basename(__filename);
const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';

const config = configJson[env];
const db = {};

let sequelize;
if (config.use_env_variable === 'production') {
  /* istanbul ignore next */
  sequelize = new Sequelize(process.env.DATABASE_URL, config);
} else if (process.env.NODE_ENV === 'test') {
  sequelize = new Sequelize(
    process.env.TEST_DATABASE_NAME,
    process.env.TEST_DATABASE_USERNAME,
    process.env.TEST_DATABASE_PASSWORD,
    config
  );
  /* istanbul ignore next */
} else {
  sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD,
    config
  );
}

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
