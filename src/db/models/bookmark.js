export default (sequelize, DataTypes) => {
  const Bookmark = sequelize.define(
    'Bookmark',
    {
      userId: DataTypes.INTEGER,
      articleId: DataTypes.INTEGER,
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {}
  );
  Bookmark.associate = () => {
    // associations can be defined here
  };
  return Bookmark;
};
