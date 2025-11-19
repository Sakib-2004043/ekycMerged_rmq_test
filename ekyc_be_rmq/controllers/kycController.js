const Kyc = require('../models/kycModel');
const jwt = require('jsonwebtoken');

const createKyc = async (req, res) => {
  try {
    // 1️⃣ Create KYC object
    const kycData = new Kyc(req.body);
    kycData.status = 'Processing...';

    // 2️⃣ Save KYC to DB first
    const savedData = await kycData.save({ validateBeforeSave: false });

    // 3️⃣ Send to RabbitMQ queue for async AI processing
    if (req.channel) {
      try {
        const messageObj = {
          email: savedData.email,
          fullName: savedData.fullName,
          phone: savedData.phone,
          address: savedData.address
        };
        req.channel.sendToQueue(
          'kycQueue',
          Buffer.from(JSON.stringify(messageObj))
        );
        console.log(`✅ Message sent to queue for ${savedData.email}`);
      } catch (queueErr) {
        console.error('⚠️ Queue error:', queueErr.message);
      }
    } else {
      console.warn('⚠️ RabbitMQ channel not available');
    }

    res.status(200).send({
      success: true,
      message: 'KYC submitted. AI description will be processed in background.',
      data: savedData
    });

  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0];
      return res.status(400).send({
        success: false,
        message: `${duplicateField} already exists.`
      });
    }

    res.status(400).send({
      success: false,
      message: 'Failed to submit KYC form.'
    });
  }
};

const loginKyc = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email exists
    const user = await Kyc.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'Email not found. Please register first.'
      });
    }

    // Compare password
    const isMatch = (password == user.password);
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: 'Incorrect password.'
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, type: user.type },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );


    // Save token as HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,        // JS cannot access the cookie
      secure: process.env.NODE_ENV === 'production', // only over HTTPS in production
      sameSite: 'strict',    // protects against CSRF
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(200).send({
      success: true,
      message: 'Login successful.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      }
    });
  } 
  catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: 'Login failed due to server error.'
    });
  }
};

const verifyToken = async (req, res, next) => {
  try {
    // 1️⃣ Get token from cookie or Authorization header
    const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
    // console.log('Verifying token:', token);
    if (!token) {
      return res.status(401).send({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // 2️⃣ Verify token and extract email
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;

    if (!email) {
      return res.status(400).send({
        success: false,
        message: 'Invalid token payload.'
      });
    }

    // 3️⃣ Find user in database using email
    const user = await Kyc.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User not found.'
      });
    }

    // 4️⃣ Attach updated user info (with type) to request
    req.user = {
      email: user.email,
      type: user.type
    };

    // 5️⃣ Continue to next handler
    next();

  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(403).send({
      success: false,
      message: 'Invalid or expired token.'
    });
  }
};

module.exports = {
  createKyc,
  loginKyc,
  verifyToken
};

