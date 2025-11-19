import axios from "axios";
import sharedData from "./aa_sharedData";

const { baseURL } = sharedData;

class AdminService {
  // 🔐 Fetch all KYC data (admin only)
  async getAllKycData(email) {
    const url = `${baseURL}/api/kyc/getAllKyc`;
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    try {
      const response = await axios.post(url, { email }, config);
      return response.data; // { success, message, data: [...] }
    } catch (error) {
      console.error("❌ Error fetching all KYC data:", error);
      throw error.response?.data || error.message;
    }
  }

  // 📝 Generate AI description for a user
  async generateDescription(userData) {
    const url = `${baseURL}/api/kyc/generateDescription`;
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    try {
      const response = await axios.post(url, userData, config);
      return response.data; // { success, message, description }
    } catch (error) {
      console.error("❌ Error generating AI description:", error);
      throw error.response?.data || error.message;
    }
  }
}

const adminService = new AdminService();
export default adminService;
