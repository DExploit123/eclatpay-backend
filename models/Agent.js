module.exports = (sequelize, DataTypes) => {
  const Agent = sequelize.define('Agent', {
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    passwordHash: DataTypes.STRING,
    location: DataTypes.STRING,
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    role: {
      type: DataTypes.ENUM('agent', 'admin'),
      defaultValue: 'agent'
    },
    profileImageUrl: {
  type: DataTypes.STRING,
  allowNull: true
}

  });

  return Agent;
};
