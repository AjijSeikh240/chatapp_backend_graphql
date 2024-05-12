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
      trim: true,
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
    isGroup: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    userId: DataTypes.INTEGER,
    messageId: DataTypes.INTEGER,
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });
  Conversation.associate = function (models) {
    // associations can be defined here
    Conversation.belongsTo(models.User, { foreignKey: "userId" });
    Conversation.belongsTo(models.Message, { foreignKey: "messageId" });
  };
  return Conversation;
};

export default Conversation;
