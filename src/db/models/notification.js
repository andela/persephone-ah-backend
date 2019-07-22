export default (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    'Notification',
    {
      senderUserId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      receiverUserId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      notificationMessage: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      link: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    { paranoid: true }
  );
  Notification.associate = models => {
    Notification.belongsTo(models.User, {
      foreignKey: 'receiverUserId',
      as: 'receiver'
    });
    Notification.belongsTo(models.User, {
      foreignKey: 'senderUserId',
      as: 'sender'
    });
  };

  return Notification;
};
