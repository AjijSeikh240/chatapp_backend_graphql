const Message = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    "Message",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
        trim: true,
        validate: {
          notNull: {
            msg: "Please provide your message",
          },
        },
      },
      userId: DataTypes.INTEGER,

      files: { type: DataTypes.ARRAY, defaultValue: [] },
    },
    {}
  );
  Message.associate = function (models) {
    // associations can be defined here
    Message.belongsTo(models.User, { foreignKey: "userId" });
    Message.hasMany(models.Conversation, { foreignKey: "messageId" });
  };
  return Message;
};

export default Message;
