module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    transactionId: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    isSynced: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    flagged: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  return Transaction;
};
