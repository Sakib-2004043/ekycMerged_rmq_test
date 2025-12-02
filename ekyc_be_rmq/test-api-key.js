// test-api-key.js
// This file tests if your OpenRouter API key is valid
// Run with: node test-api-key.js
// Delete after testing: rm test-api-key.js

const axios = require("axios");
require("dotenv").config();

const API_KEY = process.env.OPENROUTER_API_KEY;

if (!API_KEY) {
  console.error("❌ ERROR: OPENROUTER_API_KEY not found in .env file!");
  process.exit(1);
}

console.log("🔑 Testing API Key...");
console.log("API Key (first 20 chars):", API_KEY.substring(0, 20) + "...");
console.log("");

async function testApiKey() {
  try {
    console.log("📤 Sending test request to OpenRouter...");
    
    const response = await axios({
      method: "post",
      url: "https://openrouter.ai/api/v1",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      data: {
        model: "microsoft/phi-3.5-mini-128k-instruct",
        messages: [
          {
            role: "user",
            content: "Say 'Hello! API Key is valid!' - Reply with only this text.",
          },
        ],
        max_tokens: 50,
        temperature: 0.7,
      },
      timeout: 20000,
    });

    console.log("✅ SUCCESS! API Key is valid!");
    console.log("");
    console.log("📝 Response from AI:");
    console.log(response.data.choices?.[0]?.message?.content?.trim());
    console.log("");
    console.log("✨ Your OpenRouter API is working correctly!");
    process.exit(0);

  } catch (error) {
    console.error("❌ ERROR! API Key test failed!");
    console.error("");
    
    if (error.response?.status === 401) {
      console.error("🔴 Status: 401 Unauthorized");
      console.error("Possible issues:");
      console.error("  • API Key is invalid or expired");
      console.error("  • API Key is not for OpenRouter");
      console.error("  • Bearer token format is incorrect");
    } else if (error.response?.status === 429) {
      console.error("🔴 Status: 429 Too Many Requests");
      console.error("  • Rate limit exceeded");
    } else if (error.code === "ECONNREFUSED") {
      console.error("🔴 Connection Error");
      console.error("  • Check your internet connection");
      console.error("  • OpenRouter service might be down");
    } else {
      console.error("Error:", error.response?.status || error.code);
      console.error("Message:", error.message);
    }
    
    console.error("");
    console.error("Full error details:");
    console.error(error.response?.data || error.message);
    process.exit(1);
  }
}

testApiKey();
