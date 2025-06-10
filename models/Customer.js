module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    customerId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    profileImageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'URL to customer profile photo'
    },
    qrCodeUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'URL to generated QR code image'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Additional notes about the customer'
    }
  }, {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['customerId']
      },
      {
        fields: ['phone']
      },
      {
        fields: ['agentId']
      }
    ]
  });

  return Customer;
};