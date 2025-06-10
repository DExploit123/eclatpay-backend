const { Customer, Agent, Transaction } = require('../models');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

// 🔐 Helper: Check if user can access this customer
function canAccessCustomer(req, customer) {
  return req.user.role === 'admin' || customer.agentId === req.user.id;
}

// ✅ Create Customer with QR Code and Profile Image
const createCustomer = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const profileImageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const customerId = `CUST-${uuidv4().slice(0, 8).toUpperCase()}`;
    const agentId = req.user.id;

    const customer = await Customer.create({
      name,
      phone,
      address,
      customerId,
      agentId,
      profileImageUrl
    });

    const qrData = {
      customerId,
      customerDbId: customer.id,
      name,
      phone,
      agentId,
      createdAt: new Date().toISOString(),
      paymentUrl: `${process.env.FRONTEND_URL || 'https://your-app.com'}/pay/${customerId}`
    };

    const qrFileName = `qr-${customerId}-${Date.now()}.png`;
    const qrFilePath = path.join(__dirname, '../uploads', qrFileName);
    const qrCodeUrl = `/uploads/${qrFileName}`;

    if (!fs.existsSync(path.dirname(qrFilePath))) {
      fs.mkdirSync(path.dirname(qrFilePath), { recursive: true });
    }

    await QRCode.toFile(qrFilePath, JSON.stringify(qrData), {
      width: 300,
      margin: 2,
      color: { dark: '#000000', light: '#FFFFFF' },
      errorCorrectionLevel: 'M'
    });

    await customer.update({ qrCodeUrl });

    res.status(201).json({
      message: 'Customer created successfully with QR code',
      customer: {
        ...customer.toJSON(),
        qrCodeUrl,
        qrData
      }
    });

  } catch (err) {
    console.error('Error creating customer:', err);
    res.status(500).json({ error: 'Failed to create customer' });
  }
};

// ✅ Get all customers (Admin sees all, agent sees theirs)
const getAllCustomers = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { where: { agentId: req.user.id } };
    const customers = await Customer.findAll({
      ...filter,
      include: [{ model: Agent, attributes: ['name', 'phone', 'location'] }]
    });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

// ✅ Get single customer by ID
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id, {
      include: [{ model: Agent, attributes: ['name', 'phone', 'location'] }]
    });

    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    if (!canAccessCustomer(req, customer)) return res.status(403).json({ error: 'Unauthorized' });

    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching customer' });
  }
};

// ✅ Get customer by QR scan
const getCustomerByQR = async (req, res) => {
  try {
    const { qrData } = req.body;
    const parsedData = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;

    const customer = await Customer.findOne({
      where: { customerId: parsedData.customerId },
      include: [{ model: Agent, attributes: ['name', 'phone', 'location'] }]
    });

    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    res.status(200).json({
      message: 'Customer found',
      customer,
      qrVerified: true
    });

  } catch (err) {
    console.error('Error verifying QR code:', err);
    res.status(500).json({ error: 'QR code verification failed' });
  }
};

// ✅ Regenerate QR Code
const regenerateQR = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id);

    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    if (!canAccessCustomer(req, customer)) return res.status(403).json({ error: 'Unauthorized' });

    const qrData = {
      customerId: customer.customerId,
      customerDbId: customer.id,
      name: customer.name,
      phone: customer.phone,
      agentId: customer.agentId,
      regeneratedAt: new Date().toISOString(),
      paymentUrl: `${process.env.FRONTEND_URL || 'https://your-app.com'}/pay/${customer.customerId}`
    };

    const qrFileName = `qr-${customer.customerId}-${Date.now()}.png`;
    const qrFilePath = path.join(__dirname, '../uploads', qrFileName);
    const qrCodeUrl = `/uploads/${qrFileName}`;

    await QRCode.toFile(qrFilePath, JSON.stringify(qrData), {
      width: 300,
      margin: 2,
      errorCorrectionLevel: 'M'
    });

    // Delete old QR image
    if (customer.qrCodeUrl) {
      const oldPath = path.join(__dirname, '..', customer.qrCodeUrl);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await customer.update({ qrCodeUrl });

    res.status(200).json({
      message: 'QR code regenerated successfully',
      qrCodeUrl,
      qrData
    });

  } catch (err) {
    console.error('Error regenerating QR code:', err);
    res.status(500).json({ error: 'Failed to regenerate QR code' });
  }
};

// ✅ Get transaction history for a customer
const getCustomerTransactions = async (req, res) => {
  console.log('🚀 getCustomerTransactions called!');
  console.log('🔍 req.params:', req.params);
  console.log('🔍 req.user:', req.user);

  try {
    const customerId = req.params.id;
    console.log('🔍 Looking for customer with ID:', customerId);

    const customer = await Customer.findByPk(customerId);
    console.log('🔍 Customer found:', customer ? 'YES' : 'NO');

    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    if (!canAccessCustomer(req, customer)) return res.status(403).json({ error: 'Unauthorized' });

    const transactions = await Transaction.findAll({
      where: { customerId },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      message: `Transactions for customer ${customer.customerId}`,
      customer: {
        name: customer.name,
        phone: customer.phone,
        address: customer.address
      },
      transactions
    });

  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ error: 'Failed to get transactions' });
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  getCustomerByQR,
  regenerateQR,
  getCustomerTransactions
};
