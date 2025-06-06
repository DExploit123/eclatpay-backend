const { Customer, Agent } = require('../models');
const { v4: uuidv4 } = require('uuid');

const createCustomer = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const customerId = `CUST-${uuidv4().slice(0, 8).toUpperCase()}`;
    const agentId = req.user.id;

    const customer = await Customer.create({
      name,
      phone,
      address,
      customerId,
      agentId,
      qrCodeUrl: imageUrl // saved as profile photo
    });

    res.status(201).json({ message: 'Customer created', customer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create customer' });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { where: { agentId: req.user.id } };
    const customers = await Customer.findAll(filter);
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    if (req.user.role !== 'admin' && customer.agentId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching customer' });
  }
};

module.exports = { createCustomer, getAllCustomers, getCustomerById };
