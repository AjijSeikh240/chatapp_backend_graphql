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
    userId: DataTypes.INTEGER,
    conversationId: ataTypes.INTEGER,
    files: DataTypes.JSON,
  });
  Message.associate = function (models) {
    // associations can be defined here
    Message.belongsTo(models.User, { foreignKey: "senderId" });
    Message.belongsTo(models.Conversation, { foreignKey: "conversationId" });
    Message.hasMany(models.Conversation, {
      foreignKey: "latestMessageId",
      onDelete: "CASCADE",
    });
  };
  return Message;
};

export default Message;
