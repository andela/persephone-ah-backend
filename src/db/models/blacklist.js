export default (sequelize, DataTypes) => {
  const BlackList = sequelize.define('BlackList', {
    userToken: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  return BlackList;
};
