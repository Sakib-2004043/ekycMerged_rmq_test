import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import kycService from "../../services/kycService";

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

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome to User Dashboard</h1>
      <p>This is the landing page for normal users.</p>
    </div>
  );
}
