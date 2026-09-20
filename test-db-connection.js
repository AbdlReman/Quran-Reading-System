const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Simple function to load .env.local file
function loadEnvFile() {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim();
          process.env[key.trim()] = value;
        }
      }
    });
  }
}

async function testConnection() {
  console.log('🔍 Testing Database Connection...\n');
  
  // Load environment variables
  loadEnvFile();
  
  // Check environment variables
  console.log('Environment Variables:');
  console.log('- MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing');
  console.log('- NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing');
  console.log('- NEXTAUTH_URL:', process.env.NEXTAUTH_URL ? '✅ Set' : '❌ Missing');
  console.log('- NODE_ENV:', process.env.NODE_ENV || 'development');
  console.log('');
  
  if (!process.env.MONGODB_URI) {
    console.log('❌ MONGODB_URI is not set in .env.local');
    console.log('💡 Run create-env.bat to create the environment file');
    return;
  }
  
  try {
    console.log('🔌 Attempting to connect to MongoDB...');
    console.log('URI:', process.env.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    
    await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });
    
    console.log('✅ Database connection successful!');
    console.log('📊 Connection state:', mongoose.connection.readyState);
    console.log('🏠 Database name:', mongoose.connection.name);
    console.log('🔗 Host:', mongoose.connection.host);
    console.log('🚪 Port:', mongoose.connection.port);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📚 Collections:', collections.map(c => c.name));
    
  } catch (error) {
    console.log('❌ Database connection failed:');
    console.log('Error:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 MongoDB server is not running. Please start MongoDB.');
    } else if (error.message.includes('Authentication failed')) {
      console.log('\n💡 Authentication failed. Check your MongoDB credentials.');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 Could not resolve hostname. Check your MongoDB URI.');
    }
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from database');
  }
}

testConnection();
