// consumer.js
const { getChannel } = require("./connection");
const axios = require("axios");
const Kyc = require("../models/kycModel");
require("dotenv").config();

const QUEUE_NAME = process.env.RABBIT_QUEUE || "kyc_queue";

async function consumeQueue() {
  try {
    const channel = await getChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log(`🐇 Worker Listening on queue: ${QUEUE_NAME}`);

    channel.consume(
      QUEUE_NAME,
      async (msg) => {
        if (!msg) return;

        const data = JSON.parse(msg.content.toString());
        console.log("📥 Received job:", data);

        try {
          if (data.type === "GENERATE_DESCRIPTION") {
            await handleGenerateDescription(data);
          }

          channel.ack(msg);
        } catch (err) {
          console.error("❌ Worker task error:", err.message);
          channel.nack(msg, false, false);
        }
      },
      { noAck: false }
    );

  } catch (error) {
    console.error("❌ Consumer Error:", error);
  }
}

// MAIN JOB
async function handleGenerateDescription(body) {
  console.log("🤖 Generating AI description for:", body.email);

  const aiResponse = await axios({
    method: "post",
    // url: "https://openrouter.ai/api/v1/chat/completions",
    url: "https://openrouter.ai/api/v1/chat/completions",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    data: {
      model: "microsoft/phi-3.5-mini-128k-instruct",
      messages: [
        {
          role: "user",
          content: `Generate a short professional AI description (2-3 sentences max) for this user:
          Full Name: ${body.fullName || "Not provided"}
          Email: ${body.email}
          Phone: ${body.phone || "Not provided"}
          Address: ${body.address || "Not provided"}

          Return only the description, no extra text.`,
        },
      ],
      max_tokens: 200,
      temperature: 0.7,
    },
    timeout: 20000,
  });

  const description =
    aiResponse.data.choices?.[0]?.message?.content?.trim() ||
    "No AI description available";

  console.log("📝 AI Description:", description);

  await Kyc.findOneAndUpdate(
    { email: body.email },
    { status: description },
    { new: true }
  );

  console.log("💾 DB updated for:", body.email);
}

// ✔ You can put this at the bottom!
module.exports = { consumeQueue };
