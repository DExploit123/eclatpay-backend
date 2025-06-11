const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { sequelize } = require('./models');

dotenv.config(); // Load env first


const app = express(); // Create app instance before using it

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`📥 ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  console.log('📥 Headers:', req.headers.authorization ? 'Auth present' : 'No auth');
  next();
});

app.use('/uploads', express.static('uploads'));

app.use('/uploads', express.static('uploads'));


// Mount routes AFTER defining `app`
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

const customerRoutes = require('./routes/customer.routes');
app.use('/api/customers', customerRoutes);

const transactionRoutes = require('./routes/transaction.routes');
app.use('/api/transactions', transactionRoutes);

const reportRoutes = require('./routes/report.routes');
app.use('/api/reports', reportRoutes);



// Base route
app.get('/', (req, res) => {
  res.send('EclatPay PostgreSQL Backend API is running...');
});

// Connect to PostgreSQL
sequelize.authenticate()
  .then(() => {
    console.log('Connected to PostgreSQL database.');
    return sequelize.sync({ alter: true }); // Sync tables
  })
  .then(() => {
    console.log('Database synced successfully.');
    // Start server after successful sync
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection or sync failed:', err);
  });
