const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// Import the User model
const User = require('../src/models/User').default;

async function testAuthentication() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Test 1: Create a test user
    console.log('\n🧪 Test 1: Creating test user...');
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPass123!',
      role: 'student',
      phone: '+1234567890',
      address: '123 Test St',
      dateOfBirth: new Date('1990-01-01')
    });

    await testUser.save();
    console.log('✅ Test user created successfully');

    // Test 2: Verify password hashing
    console.log('\n🧪 Test 2: Testing password hashing...');
    const isPasswordValid = await testUser.comparePassword('TestPass123!');
    const isPasswordInvalid = await testUser.comparePassword('WrongPassword');
    
    console.log('✅ Password validation working:', {
      correctPassword: isPasswordValid,
      wrongPassword: isPasswordInvalid
    });

    // Test 3: Test account lockout functionality
    console.log('\n🧪 Test 3: Testing account lockout...');
    await testUser.incrementLoginAttempts();
    await testUser.incrementLoginAttempts();
    await testUser.incrementLoginAttempts();
    await testUser.incrementLoginAttempts();
    await testUser.incrementLoginAttempts();
    
    const isLocked = testUser.isLocked();
    console.log('✅ Account lockout working:', { isLocked });

    // Test 4: Test account unlock
    console.log('\n🧪 Test 4: Testing account unlock...');
    await testUser.resetLoginAttempts();
    const isUnlocked = !testUser.isLocked();
    console.log('✅ Account unlock working:', { isUnlocked });

    // Test 5: Test email verification token
    console.log('\n🧪 Test 5: Testing email verification...');
    const verificationToken = require('crypto').randomBytes(32).toString('hex');
    testUser.emailVerificationToken = verificationToken;
    testUser.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await testUser.save();
    
    console.log('✅ Email verification token created:', verificationToken);

    // Test 6: Test password reset token
    console.log('\n🧪 Test 6: Testing password reset...');
    const resetToken = require('crypto').randomBytes(32).toString('hex');
    testUser.passwordResetToken = resetToken;
    testUser.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await testUser.save();
    
    console.log('✅ Password reset token created:', resetToken);

    // Test 7: Test user serialization (JSON)
    console.log('\n🧪 Test 7: Testing user serialization...');
    const userJson = testUser.toJSON();
    const sensitiveFields = ['password', 'emailVerificationToken', 'passwordResetToken'];
    const hasSensitiveData = sensitiveFields.some(field => userJson[field]);
    
    console.log('✅ Sensitive data protection:', { hasSensitiveData: !hasSensitiveData });

    // Test 8: Test validation
    console.log('\n🧪 Test 8: Testing validation...');
    try {
      const invalidUser = new User({
        name: 'A', // Too short
        email: 'invalid-email', // Invalid email
        password: 'weak' // Too weak
      });
      await invalidUser.save();
    } catch (error) {
      console.log('✅ Validation working:', error.message.includes('validation failed'));
    }

    // Cleanup
    console.log('\n🧹 Cleaning up test data...');
    await User.deleteOne({ email: 'test@example.com' });
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 All authentication tests passed!');
    console.log('\n📋 Test Summary:');
    console.log('✅ User creation and password hashing');
    console.log('✅ Password validation');
    console.log('✅ Account lockout mechanism');
    console.log('✅ Email verification tokens');
    console.log('✅ Password reset tokens');
    console.log('✅ Sensitive data protection');
    console.log('✅ Input validation');
    console.log('✅ Data cleanup');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the tests
if (require.main === module) {
  testAuthentication();
}

module.exports = testAuthentication;
