const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

// =================== CORS ===================
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// =================== ROUTES ===================
const kycRoute = require('./routes/kycRoute');
app.use('/api/kyc', kycRoute);

app.get('/', (req, res) => {
  res.send('🚀 KYC Backend Server Running with RabbitMQ...');
});

// ================ SERVER + DB + RABBITMQ ================
const PORT = process.env.PORT || 3200;

(async () => {
  try {
    // MongoDB Connect
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected');

    // Start Server
    app.listen(PORT, () => {
      console.log(`✅ Server running → http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('❌ Startup Error:', err);
  }
})();
