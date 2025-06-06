const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Agent } = require('../models');

const register = async (req, res) => {
  try {
    const { name, phone, password, role, location } = req.body;
    const profileImageUrl = req.file ? `/uploads/${req.file.filename}` : null;


    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Agent.create({
      name,
      phone,
      location,
      passwordHash: hashedPassword,
      role: role || 'agent',
      profileImageUrl
    });

    res.status(201).json({ message: 'User registered', userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await Agent.findOne({ where: { phone } });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await Agent.findByPk(req.user.id, {
      attributes: ['id', 'name', 'phone', 'location', 'role']
    });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

module.exports = { register, login, getProfile };
