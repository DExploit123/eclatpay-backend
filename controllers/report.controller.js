const { Customer, Agent, Transaction, sequelize } = require('../models');
const { Op } = require('sequelize');


const getSummaryReport = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can access reports' });
    }

    // Total customers
    const totalCustomers = await Customer.count();

    // Total agents
    const totalAgents = await Agent.count({ where: { role: 'agent' } });

    // Total transactions
    const totalTransactions = await Transaction.count();

    // Total savings amount
    const totalAmountSaved = await Transaction.sum('amount');

    // Top 5 agents by total savings
  const topAgents = await Transaction.findAll({
  attributes: [
    'agentId',
    [sequelize.fn('SUM', sequelize.col('amount')), 'totalSaved']
  ],
  group: ['agentId', 'Agent.id'],
  order: [[sequelize.col('totalSaved'), 'DESC']], // 🔧 Fix applied here
  limit: 5,
  include: {
    model: Agent,
    attributes: ['id', 'name', 'location']
  }
});


    res.json({
      totalCustomers,
      totalAgents,
      totalTransactions,
      totalAmountSaved,
      topAgents
    });

  } catch (err) {
    console.error('Error generating report:', err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};

module.exports = { getSummaryReport };
