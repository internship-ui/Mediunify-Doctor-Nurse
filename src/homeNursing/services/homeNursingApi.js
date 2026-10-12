/**
 * MediUnify — Home Nursing API Service
 * 
 * Configure this service to connect to your backend server.
 * Replace API_BASE_URL with your actual backend URL (e.g., https://api.mediunify.com/api/home-nursing).
 */

export const API_BASE_URL = 'http://localhost:5000/api/home-nursing';

export const homeNursingApi = {
  /**
   * Home Nursing Sign In
   * @param {Object} credentials - { emailOrPhone, password }
   */
  async login({ emailOrPhone, password }) {
    try {
      // In production, uncomment fetch call:
      // const response = await fetch(`${API_BASE_URL}/login`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ emailOrPhone, password }),
      // });
      // return await response.json();

      // Simulated network delay & response
      await new Promise((res) => setTimeout(res, 600));
      return {
        success: true,
        token: 'mock-jwt-token-home-nursing',
        user: {
          emailOrPhone,
          role: 'home_nursing',
        },
      };
    } catch (error) {
      console.error('Home Nursing Login Error:', error);
      throw error;
    }
  },

  /**
   * Create Home Nursing Account
   * @param {Object} data - Nurse registration payload containing personal, professional, documents, and account details
   */
  async register(data) {
    try {
      const {
        fullName,
        profilePhoto,
        dob,
        gender,
        phoneNumber,
        email,
        residentialAddress,
        cityArea,
        pincode,
        qualification,
        licenseNumber,
        registrationAuthority,
        yearsOfExperience,
        specialization,
        workExperience,
        registrationCertificate,
        qualificationCertificate,
        govtIdProof,
        password,
      } = data;

      // In production, uncomment fetch call:
      // const response = await fetch(`${API_BASE_URL}/register`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // return await response.json();

      // Simulated network delay & response
      await new Promise((res) => setTimeout(res, 700));
      return {
        success: true,
        message: 'Home Nursing Registration submitted successfully for verification',
        user: {
          fullName,
          email,
          phoneNumber,
          licenseNumber,
          qualification,
          registrationAuthority,
          yearsOfExperience,
          specialization,
          cityArea,
          gender,
          role: 'home_nursing',
          status: 'pending_verification',
        },
      };
    } catch (error) {
      console.error('Home Nursing Registration Error:', error);
      throw error;
    }
  },

  /**
   * Send OTP to Nurse Mobile Number
   * @param {Object} param - { phoneNumber }
   */
  async sendOtp({ phoneNumber }) {
    try {
      // In production, uncomment fetch call:
      // const response = await fetch(`${API_BASE_URL}/send-otp`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ phoneNumber }),
      // });
      // return await response.json();

      await new Promise((res) => setTimeout(res, 500));
      return {
        success: true,
        message: `OTP sent successfully to ${phoneNumber}`,
        mockOtp: '4582',
      };
    } catch (error) {
      console.error('Send OTP Error:', error);
      throw error;
    }
  },

  /**
   * Verify OTP for Nurse Mobile Number
   * @param {Object} param - { phoneNumber, otp }
   */
  async verifyOtp({ phoneNumber, otp }) {
    try {
      // In production, uncomment fetch call:
      // const response = await fetch(`${API_BASE_URL}/verify-otp`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ phoneNumber, otp }),
      // });
      // return await response.json();

      await new Promise((res) => setTimeout(res, 500));
      // Accepts any 4-digit code (or 4582 / 1234) for smooth testing
      if (otp.trim().length === 4) {
        return {
          success: true,
          verified: true,
          message: 'Mobile number verified successfully',
        };
      }
      throw new Error('Invalid OTP. Please enter the 4-digit verification code.');
    } catch (error) {
      console.error('Verify OTP Error:', error);
      throw error;
    }
  },

  /**
   * Fetch Home Nursing Practitioner Profile
   * @param {string} token
   */
  async getProfile(token) {
    try {
      // const response = await fetch(`${API_BASE_URL}/profile`, {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      // return await response.json();
      return {
        success: true,
        profile: {
          name: 'Home Nursing Nurse',
          verified: false,
        },
      };
    } catch (error) {
      console.error('Home Nursing Get Profile Error:', error);
      throw error;
    }
  },
};

export default homeNursingApi;
