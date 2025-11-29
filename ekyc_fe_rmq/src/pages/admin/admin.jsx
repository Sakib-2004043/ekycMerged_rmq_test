import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import kycService from "../../services/kycService";
import adminService from "../../services/adminService";
import "./admin.css";
import { jsPDF } from "jspdf";

export default function Admin() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [loading, setLoading] = useState(true);
  const [kycData, setKycData] = useState([]);
  const [error, setError] = useState("");

  // ✅ Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");

  // ✅ Row-specific loading state for AI generation
  const [generatingIds, setGeneratingIds] = useState([]); // array of user._id currently generating
  const pollingIntervalRef = useRef(null);

  // Function to fetch KYC data
  const fetchKycData = useCallback(async () => {
    try {
      const response = await adminService.getAllKycData(email);
      if (response.success) {
        setKycData(response.data);
        
        // Check if any previously generating IDs now have descriptions
        setGeneratingIds(prev => {
          const updatedGeneratingIds = prev.filter(id => {
            const user = response.data.find(u => u._id === id);
            return user && (!user.status || user.status === "Pending");
          });
          
          // If all jobs are complete, stop polling
          if (updatedGeneratingIds.length === 0 && prev.length > 0) {
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }
          }
          
          return updatedGeneratingIds;
        });
      } else {
        setError(response.message || "Failed to fetch data.");
      }
    } catch (err) {
      console.error("Error fetching KYC data:", err);
    }
  }, [email]);

  useEffect(() => {
    if (!email) {
      navigate("/login");
      return;
    }

    const fetchAdminData = async () => {
      try {
        const verifyResponse = await kycService.verifyEmail(email);
        const userType = verifyResponse.user?.type;

        if (userType !== "admin") {
          navigate("/user", { state: { email } });
          return;
        }

        await fetchKycData();
        setLoading(false);
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    fetchAdminData();

    // Cleanup polling on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [email, navigate, fetchKycData]);

  // ✅ Function to open modal
  const handleViewDescription = (description) => {
    setSelectedDescription(description || "No description available");
    setShowModal(true);
  };

  // ✅ Function to close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedDescription("");
  };

  // ✅ Handle Go button click to generate AI description
  const handleGenerate = async (user) => {
    try {
      // Mark this row as loading
      setGeneratingIds((prev) => [...prev, user._id]);

      // Send job to backend (enqueue in RabbitMQ)
      const response = await adminService.generateDescription(user);

      if (response.success) {
        // Start polling for updates every 3 seconds
        if (!pollingIntervalRef.current) {
          pollingIntervalRef.current = setInterval(() => {
            fetchKycData();
          }, 3000);
        }
        
        // Show success notification without blocking
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.textContent = '✓ AI description generation started. Updates will appear automatically.';
        document.body.appendChild(notification);
        
        setTimeout(() => {
          notification.classList.add('fade-out');
          setTimeout(() => notification.remove(), 500);
        }, 4000);
      } else {
        // Remove loading state if failed
        setGeneratingIds((prev) => prev.filter((id) => id !== user._id));
        
        // Show error notification
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.textContent = `✗ ${response.message || "Failed to queue job."}`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
          notification.classList.add('fade-out');
          setTimeout(() => notification.remove(), 500);
        }, 4000);
      }
    } catch (err) {
      console.error("❌ Error generating AI description:", err);
      setGeneratingIds((prev) => prev.filter((id) => id !== user._id));
      
      // Show error notification
      const notification = document.createElement('div');
      notification.className = 'error-notification';
      notification.textContent = `✗ ${err.message || "Something went wrong!"}`;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
      }, 4000);
    }
  };

  const handleDownloadPDF = (user) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("KYC Report", 105, 20, { align: "center" });

    // User details
    doc.setFontSize(12);
    let y = 40;
    const lineHeight = 8;

    const fields = [
      { label: "Full Name", value: user.fullName },
      { label: "Email", value: user.email },
      { label: "Phone", value: user.phone },
      { label: "Address", value: user.address },
      { label: "DOB", value: new Date(user.dob).toLocaleDateString() },
      { label: "Age", value: user.age },
      { label: "Gender", value: user.gender },
      { label: "Type", value: user.type },
      { label: "AI Description", value: user.status },
    ];

    fields.forEach(({ label, value }) => {
      const text = `${label}: ${value || "N/A"}`;
      // Wrap long text to fit page width
      const splitText = doc.splitTextToSize(text, 170); // 170mm width
      doc.text(splitText, 20, y);
      y += splitText.length * lineHeight;
    });

    // Save PDF
    doc.save(`${user.fullName || "KYC_Report"}.pdf`);
  };


  if (loading) return <p>Loading...</p>;

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>

      {error && <p className="admin-error">{error}</p>}

      {kycData.length > 0 ? (
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>DOB</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Description</th>
                <th>Type</th>
                <th>Generate</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {kycData.map((user) => (
                <tr key={user._id}>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.address}</td>
                  <td>{new Date(user.dob).toLocaleDateString()}</td>
                  <td>{user.age}</td>
                  <td>{user.gender}</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => handleViewDescription(user.status)}
                    >
                      View
                    </button>
                  </td>
                  <td>{user.type}</td>
                  <td>
                    <button
                      className="generate-btn"
                      onClick={() => handleGenerate(user)}
                      disabled={generatingIds.includes(user._id)}
                    >
                      {generatingIds.includes(user._id) ? "Generating..." : "Go"}
                    </button>
                  </td>
                  <td>
                    <button
                      className="download-btn"
                      onClick={() => handleDownloadPDF(user)}
                    >
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-data-msg">No KYC data found.</p>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">AI Description</h3>
            <p className="modal-content">{selectedDescription}</p>
            <button className="close-btn" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );

}
