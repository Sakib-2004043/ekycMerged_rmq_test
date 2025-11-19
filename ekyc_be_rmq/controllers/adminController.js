const Kyc = require('../models/kycModel');
const axios = require('axios');
const { publishMessage } = require("../rabbitMQ/publisher");


/**
 * GET all KYC data if the user is admin
 * Expects: { email } in request body
 */
const getAllKycData = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({
        success: false,
        message: 'Email is required.'
      });
    }

    // Find the user by email
    const user = await Kyc.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User not found.'
      });
    }

    // Check if user is admin
    if (user.type !== 'admin') {
      return res.status(403).send({
        success: false,
        message: 'Access denied. Only admins can fetch all data.'
      });
    }

    // Fetch all KYC data
    const allKycData = await Kyc.find().sort({ createdAt: -1 }); // latest first

    res.status(200).send({
      success: true,
      message: 'All KYC data fetched successfully.',
      data: allKycData
    });

  } catch (error) {
    console.error('Error fetching KYC data:', error);
    res.status(500).send({
      success: false,
      message: 'Server error.'
    });
  }
};


// // kycAdmin.js (or wherever you keep the controller)
// const generateDescription = async (req, res) => {
//   try {
//     const body = req.body;          // now you get the data directly

//     if (!body || !body.email) {
//       console.log('Missing data:', body);
//       return res.status(400).json({ 
//         success: false, 
//         error: 'User email is required.' 
//       });
//     }

//     console.log('Generating AI description for:', body.email);

//     // AI call
//     const aiResponse = await axios({
//       method: 'post',
//       url: 'https://openrouter.ai/api/v1/chat/completions',
//       headers: {
//         'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
//         'Content-Type': 'application/json'
//       },
//       data: {
//         model: 'microsoft/phi-3.5-mini-128k-instruct',
//         messages: [{
//           role: 'user',
//           content: `Generate a short professional AI description (2-3 sentences max) for this user:
//           Full Name: ${body.fullName || 'Not provided'}
//           Email: ${body.email}
//           Phone: ${body.phone || 'Not provided'}
//           Address: ${body.address || 'Not provided'}

//           Return only the description, no extra text.`
//         }],
//         max_tokens: 200,
//         temperature: 0.7
//       },
//       timeout: 20000
//     });

//     const description = aiResponse.data.choices?.[0]?.message?.content?.trim()
//                         || 'No AI description available';

//     console.log('AI description:', description);

//     // Update DB
//     const updatedUser = await Kyc.findOneAndUpdate(
//       { email: body.email },
//       { status: description },
//       { new: true }
//     );

//     if (!updatedUser) {
//       console.log('User not found in DB for email:', body.email);
//     } else {
//       console.log('DB updated successfully');
//     }

//     // THIS IS THE LINE THAT MAKES IT FINISH
//     return res.json({
//       success: true,
//       description,
//       user: updatedUser
//     });

//   } catch (err) {
//     console.error('generateDescription error:', err.response?.data || err.message);

//     return res.status(500).json({
//       success: false,
//       error: 'Failed to generate description',
//       details: err.message
//     });
//   }
// };

// kycAdmin.js

const generateDescription = async (req, res) => {
  try {
    const body = req.body;

    if (!body || !body.email) {
      return res.status(400).json({
        success: false,
        error: "User email is required.",
      });
    }

    console.log("📤 Queuing request for AI description of:", body.email);

    // Send job to queue
    await publishMessage({
      type: "GENERATE_DESCRIPTION",
      email: body.email,
      fullName: body.fullName,
      phone: body.phone,
      address: body.address,
    });

    return res.json({
      success: true,
      message: "AI description job queued successfully.",
    });

  } catch (error) {
    console.error("❌ Controller error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to queue description job.",
    });
  }
};

module.exports = {
  getAllKycData,
  generateDescription
};
