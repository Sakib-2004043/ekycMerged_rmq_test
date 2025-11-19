import axios from "axios";
import sharedData from "./aa_sharedData";

const { baseURL } = sharedData;

class KycService {
  // 📝 Submit KYC form
  async submitKyc(formData) {
    const url = `${baseURL}/api/kyc/submitKyc`;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // include cookies
    };

    try {
      const response = await axios.post(url, formData, config);
      return response.data;
    } catch (error) {
      console.error("❌ Error in submitting KYC:", error);
      throw error.response?.data || error.message;
    }
  }

  // 🔐 Login and save JWT token to cookie (handled by backend)
  async login(email, password) {
    const url = `${baseURL}/api/kyc/login`;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // allow cookies
    };

    try {
      const response = await axios.post(
        url,
        { email, password },
        config
      );
      return response.data; // contains { success, message, token? }
    } catch (error) {
      console.error("❌ Error in login:", error);
      throw error.response?.data || error.message;
    }
  }

  async verifyEmail(email) {
    const url = `${baseURL}/api/kyc/verify`;
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    try {
      const response = await axios.post(url, { email }, config);
      return response.data; // { success, message, user: { email, type } }
    } catch (error) {
      console.error("❌ Error in verifying email:", error);
      throw error.response?.data || error.message;
    }
  }

}

const kycService = new KycService();
export default kycService;
