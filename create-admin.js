const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['CUSTOMER', 'ADMIN'], default: 'CUSTOMER' },
});

const User = mongoose.model('User', UserSchema);

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const adminEmail = 'admin@example.com';
  const adminPassword = 'admin123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = new User({
    name: 'Admin',
    email: adminEmail,
    password: hashedPassword,
    role: 'ADMIN',
  });

  try {
    await admin.save();
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
