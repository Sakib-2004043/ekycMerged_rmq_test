const express = require('express');
const router = express.Router();
const kycController = require('../controllers/kycController');
const kycAdmin = require('../controllers/adminController');

// ✅ POST — KYC submission (Register)
router.post('/submitKyc', kycController.createKyc);

// ✅ POST — Login
router.post('/login', kycController.loginKyc);

// POST — Verify token and send email + type to frontend
router.post('/verify', kycController.verifyToken, (req, res) => {
  res.status(200).send({
    success: true,
    message: 'Token verified successfully.',
    user: req.user // contains { email, type }
  });
});

// ✅ POST — Get all KYC data (Admin only)
router.post('/getAllKyc', kycAdmin.getAllKycData);

// ✅ POST — Generate AI description for a user
router.post('/generateDescription', kycAdmin.generateDescription);

module.exports = router;
