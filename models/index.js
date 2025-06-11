const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_URL,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    logging: false
  }
);

// Load models
const models = {
  Agent: require('./Agent')(sequelize, DataTypes),
  Customer: require('./Customer')(sequelize, DataTypes),
  Transaction: require('./Transaction')(sequelize, DataTypes)
};

// Setup relationships
models.Agent.hasMany(models.Customer, { foreignKey: 'agentId' });
models.Customer.belongsTo(models.Agent, { foreignKey: 'agentId' });

models.Agent.hasMany(models.Transaction, { foreignKey: 'agentId' });
models.Customer.hasMany(models.Transaction, { foreignKey: 'customerId' });

models.Transaction.belongsTo(models.Agent, { foreignKey: 'agentId' });
models.Transaction.belongsTo(models.Customer, { foreignKey: 'customerId' });

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
