const Conversation = (sequelize, DataTypes) => {
  const Conversation = sequelize.define("Conversation", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 10],
        notNull: {
          msg: "Please enter your name",
        },
      },
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please provide you picture",
        },
      },
    },
    senderId: DataTypes.INTEGER,
    receiverId: DataTypes.INTEGER,
    latestMessageId: DataTypes.INTEGER,
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isGroup: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });
  Conversation.associate = function (models) {
    // associations can be defined here
    Conversation.belongsTo(models.User, { foreignKey: "senderId" });
    Conversation.belongsTo(models.User, { foreignKey: "receiverId" });
    Conversation.belongsTo(models.User, { foreignKey: "adminId" });
    Conversation.belongsTo(models.Message, { foreignKey: "latestMessageId" });
    Conversation.hasMany(models.Message, {
      foreignKey: "conversationId",
      onDelete: "CASCADE",
    });
  };
  return Conversation;
};

export default Conversation;
