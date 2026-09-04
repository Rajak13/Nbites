import { connectDatabase, disconnectDatabase } from '../config/db';
import { User } from '../models/user.model';
import { generateOtp, verifyOtp } from '../services/otp.service';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

async function testAuth() {
  console.log('🧪 [Test] Starting Auth & User Profile Verification...');
  console.log('====================================================');

  await connectDatabase();

  try {
    const testPhone = '9841999888';

    // 1. Test OTP Generation
    console.log('\n--- [TEST 1: OTP Generation & Storage] ---');
    const code = await generateOtp(testPhone);
    console.log(`✅ Generated 6-digit OTP for +977 ${testPhone}: ${code}`);
    if (code.length !== 6) throw new Error('OTP length invalid');

    // 2. Test Invalid OTP verification
    console.log('\n--- [TEST 2: Invalid OTP Rejection] ---');
    const badVerify = await verifyOtp(testPhone, '000000');
    console.log(`✅ Verification of invalid code returned:`, badVerify);
    if (badVerify.success) throw new Error('Should have failed with invalid code');

    // 3. Test Valid OTP verification
    console.log('\n--- [TEST 3: Valid OTP Acceptance] ---');
    const goodVerify = await verifyOtp(testPhone, code);
    console.log(`✅ Verification of valid code returned:`, goodVerify);
    if (!goodVerify.success) throw new Error('Valid OTP verification failed');

    // 4. Test Replay Prevention (OTP should be deleted after verification)
    console.log('\n--- [TEST 4: Replay Attack Prevention] ---');
    const replayVerify = await verifyOtp(testPhone, code);
    console.log(`✅ Replay attempt returned:`, replayVerify);
    if (replayVerify.success) throw new Error('Replay attack should have been blocked');

    // 5. Test User MongoDB Upsert & Persistence
    console.log('\n--- [TEST 5: User Persistence in Atlas] ---');
    let user = await User.findOne({ phone: testPhone });
    if (!user) {
      user = await User.create({
        phone: testPhone,
        name: 'Prashant Maharjan',
        role: 'CUSTOMER',
        themePreference: 'cream',
        lastLoginAt: new Date(),
        savedAddresses: [{ label: 'Home', landmark: 'Jhamsikhel, Near Fireclub' }],
      });
      console.log(`✅ Created new customer in Atlas: ${user.name} (${user.phone})`);
    } else {
      user.lastLoginAt = new Date();
      await user.save();
      console.log(`✅ Updated existing customer in Atlas: ${user.name} (${user.phone})`);
    }

    // 6. Test JWT Token Generation
    console.log('\n--- [TEST 6: JWT Signing & Verification] ---');
    const token = jwt.sign(
      { id: user._id.toString(), phone: user.phone, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn } as jwt.SignOptions
    );
    console.log(`✅ Signed JWT: ${token.slice(0, 30)}...`);

    const decoded = jwt.verify(token, config.jwt.secret) as any;
    console.log(`✅ Decoded token payload:`, { id: decoded.id, phone: decoded.phone, role: decoded.role });

    // 7. Test Theme Preference Switching
    console.log('\n--- [TEST 7: Theme Preference Switch to "dark"] ---');
    user.themePreference = 'dark';
    await user.save();
    const updatedUser = await User.findById(user._id);
    console.log(`✅ User theme preference verified in DB: ${updatedUser?.themePreference}`);
    if (updatedUser?.themePreference !== 'dark') throw new Error('Theme update failed');

    // Reset back to cream
    user.themePreference = 'cream';
    await user.save();

    console.log('\n====================================================');
    console.log('🎉 ALL AUTH & PROFILE TESTS PASSED SUCCESSFULLY!');
    console.log('====================================================\n');
  } catch (err) {
    console.error('❌ Test failed:', err);
  } finally {
    await disconnectDatabase();
  }
}

testAuth();
