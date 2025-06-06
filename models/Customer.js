module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    customerId: DataTypes.STRING,
    qrCodeUrl: DataTypes.STRING
  });

  return Customer;
};
