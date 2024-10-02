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
        len: [5, 50],
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
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });
  Conversation.associate = function (models) {
    // associations can be defined here
    Conversation.belongsTo(models.User, {
      foreignKey: "senderId",
      onDelete: "CASCADE",
    });
    Conversation.belongsTo(models.User, {
      foreignKey: "receiverId",
      onDelete: "CASCADE",
    });

    Conversation.belongsTo(models.Message, {
      foreignKey: "latestMessageId",
      onDelete: "CASCADE",
    });
    Conversation.hasMany(models.Message, {
      foreignKey: "conversationId",
      onDelete: "CASCADE",
    });
  };
  return Conversation;
};

export default Conversation;
