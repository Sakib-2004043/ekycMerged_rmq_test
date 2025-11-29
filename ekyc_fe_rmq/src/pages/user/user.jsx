import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import kycService from "../../services/kycService";
import "./user.css";

export default function UserLanding() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        // Call backend to verify user type
        const response = await kycService.verifyEmail(localStorage.getItem("email"));
        const userType = response.user?.type;

        if (userType !== "user") {
          // Redirect to admin if not a normal user
          navigate("/admin");
        } else {
          // Allow access
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        // Redirect to login if verification fails
        navigate("/login");
      }
    };

    verifyUser();
  }, [navigate]);

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading your dashboard...</p>
    </div>
  );

  return (
    <div className="user-dashboard">
      <div className="user-hero">
        <h1>Welcome to Your Dashboard</h1>
        <p>Manage your KYC verification and profile information</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-icon">✅</div>
          <h3>KYC Status</h3>
          <p className="status-badge verified">Verified</p>
          <p className="card-description">Your identity has been successfully verified</p>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">📄</div>
          <h3>Documents</h3>
          <p className="card-description">View and manage your submitted documents</p>
          <button className="card-button">View Documents</button>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">👤</div>
          <h3>Profile</h3>
          <p className="card-description">Update your personal information</p>
          <button className="card-button">Edit Profile</button>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">🔔</div>
          <h3>Notifications</h3>
          <p className="card-description">Check your recent notifications</p>
          <button className="card-button">View All</button>
        </div>
      </div>

      <div className="info-section">
        <h2>Quick Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Account Type:</span>
            <span className="info-value">Standard User</span>
          </div>
          <div className="info-item">
            <span className="info-label">Member Since:</span>
            <span className="info-value">2024</span>
          </div>
          <div className="info-item">
            <span className="info-label">Verification Level:</span>
            <span className="info-value">Level 2</span>
          </div>
        </div>
      </div>
    </div>
  );
}
