// worker.js
require("dotenv").config();
const mongoose = require("mongoose");

// 1️⃣ MongoDB connection for Worker process
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("🍃 MongoDB Connected in Worker"))
  .catch((err) => console.error("❌ Worker DB Connection Error:", err));

// 2️⃣ RabbitMQ Consumer
const { consumeQueue } = require("./rabbitMQ/consumer");

// 3️⃣ Log RabbitMQ URL
const rabbitURL = process.env.RABBITMQ_URL || "amqp://localhost:5672";
console.log(`📡 RabbitMQ URL: ${rabbitURL}`);

console.log("🚀 Worker starting...");
consumeQueue();
