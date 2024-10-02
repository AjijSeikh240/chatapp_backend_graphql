const Message = (sequelize, DataTypes) => {
  const Message = sequelize.define("Message", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,

      validate: {
        notNull: {
          msg: "Please provide your message",
        },
      },
    },
    senderId: DataTypes.INTEGER,
    conversationId: DataTypes.INTEGER,
    files: DataTypes.JSON,
  });
  Message.associate = function (models) {
    // associations can be defined here
    Message.belongsTo(models.User, {
      foreignKey: "senderId",
      onDelete: "CASCADE",
    });
    Message.belongsTo(models.Conversation, {
      foreignKey: "conversationId",
      onDelete: "CASCADE",
    });
    Message.hasMany(models.Conversation, {
      foreignKey: "latestMessageId",
      onDelete: "CASCADE",
    });
  };
  return Message;
};

export default Message;
