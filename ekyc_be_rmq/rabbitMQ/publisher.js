// publisher.js
const { getChannel } = require("./connection");
require("dotenv").config();

const QUEUE_NAME = process.env.RABBIT_QUEUE || "kyc_queue";

async function publishMessage(data) {
  try {
    const channel = await getChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });

    channel.sendToQueue(
      QUEUE_NAME,
      Buffer.from(JSON.stringify(data)),
      { persistent: true }
    );

    console.log("📤 Published:", data);
  } catch (error) {
    console.error("❌ Publish Error:", error);
  }
}

module.exports = { publishMessage };
