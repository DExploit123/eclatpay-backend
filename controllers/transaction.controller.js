const { Transaction, Customer } = require('../models');
const { v4: uuidv4 } = require('uuid');

const createTransaction = async (req, res) => {
  try {
    const { customerId, amount } = req.body;

    const customer = await Customer.findByPk(customerId);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const transactionId = `TXN-${uuidv4().slice(0, 8).toUpperCase()}`;

    const transaction = await Transaction.create({
      transactionId,
      amount,
      customerId: customer.id,
      agentId: req.user.id
    });

    res.status(201).json({ message: 'Transaction saved', transaction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save transaction' });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { where: { agentId: req.user.id } };
    const transactions = await Transaction.findAll(filter);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving transactions' });
  }
};

const getByCustomer = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { customerId: req.params.id }
    });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

module.exports = { createTransaction, getAllTransactions, getByCustomer };
