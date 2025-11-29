import React from 'react';
import { Link } from 'react-router-dom';
import './landing.css';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <div className="landing-hero">
        <h1>Welcome to eKYC Portal</h1>
        <p>Secure, Fast, and Reliable Digital Identity Verification</p>
        <div className="cta-buttons">
          <Link to="/signup" className="btn btn-primary">
            Get Started
          </Link>
          <Link to="/login" className="btn btn-secondary">
            Sign In
          </Link>
        </div>
      </div>

      <div className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Verification</h3>
            <p>Bank-grade encryption ensures your personal information is always protected.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast Processing</h3>
            <p>Complete your KYC verification in minutes with our streamlined process.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI-Powered</h3>
            <p>Advanced AI technology for accurate document verification and fraud detection.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
