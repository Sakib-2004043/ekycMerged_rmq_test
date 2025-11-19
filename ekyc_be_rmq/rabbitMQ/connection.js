// connection.js
const amqp = require("amqplib");
require("dotenv").config();

let channel = null;

async function getChannel() {
  if (channel) return channel;

  try {
    const connection = await amqp.connect(process.env.RABBIT_URL || "amqp://localhost");
    channel = await connection.createChannel();
    console.log("🔗 RabbitMQ Connected");
    return channel;
  } catch (error) {
    console.error("❌ RabbitMQ Connection Error:", error);
    throw error;
  }
}

module.exports = { getChannel };
