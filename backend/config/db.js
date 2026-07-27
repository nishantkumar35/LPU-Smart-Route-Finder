const mongoose = require('mongoose');
const dns = require('dns');

// Force Node.js to use Google/Cloudflare public DNS servers to resolve MongoDB Atlas SRV records
// Prevents "querySrv ECONNREFUSED" issues on networks with restricted local DNS
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (err) {
  console.warn('DNS server override notice:', err.message);
}

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is missing from environment variables. Please check your .env file.');
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4, // Force IPv4 to prevent IPv6 ECONNREFUSED issues
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
