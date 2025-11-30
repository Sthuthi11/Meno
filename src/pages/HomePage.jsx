import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logout } from "../firebase"; // adjust path if needed
import { useAuthState } from "react-firebase-hooks/auth";
import { FaBars, FaTimes } from "react-icons/fa";
import "./HomePage.css";

const HomePage = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when clicking outside (mobile only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && window.innerWidth <= 1023) {
        const sidebar = document.querySelector(".sidebar");
        const menuBtn = document.querySelector(".menu-btn");

        if (
          sidebar &&
          !sidebar.contains(event.target) &&
          menuBtn &&
          !menuBtn.contains(event.target)
        ) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  // Close sidebar when resizing to large screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1023 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  // Prevent body scroll on mobile when sidebar is open
  useEffect(() => {
    if (sidebarOpen && window.innerWidth <= 1023) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  // Handle device connection
  const handleConnectDevice = () => {
    // Simulated IoT device data
    const mockDeviceData = {
      temperature: (36 + Math.random() * 2).toFixed(1), // 36–38 °C
      heartRate: Math.floor(60 + Math.random() * 40), // 60–100 bpm
      sleepQuality: ["Good", "Average", "Poor"][Math.floor(Math.random() * 3)],
      mood: ["Calm", "Stressed", "Irritable", "Happy"][Math.floor(Math.random() * 4)],
    };

    alert("Device Connected!");

    navigate("/device-details", { state: { deviceData: mockDeviceData } });
  };

  // Open Streamlit questionnaire (ngrok URL)
  const handleOpenQuestionnaire = () => {
  window.open("https://menosense.streamlit.app/", "_self");
};


  return (
    <div className="homepage">
      {/* Header */}
      <header className="header">
        <div className="flex items-center justify-start">
        <img
          src="https://cdn-icons-gif.flaticon.com/11290/11290536.gif"
          alt="MenoSense Logo"
          className="w-8 h-8 mr-3"
        />
        <h1 className="text-3xl font-extrabold text-purple-600 tracking-wide drop-shadow-lg">
          MenoSense
        </h1>
      </div>

        <button
          className="menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </header>

      <div className="container">
        {/* Overlay */}
        <div
          className={`overlay ${sidebarOpen ? "show" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="profile-section">
            <img
              src={user?.photoURL || "https://via.placeholder.com/80"}
              alt="Profile"
              className="profile-pic"
            />
            <p className="email">{user?.email || "Guest User"}</p>
          </div>
          <nav className="sidebar-nav">
            <Link
              to="/profile"
              onClick={() => setSidebarOpen(false)}
              className="nav-link"
            >
              View Profile
            </Link>
            <button
              onClick={() => {
                logout();
                setSidebarOpen(false);
              }}
              className="logout-btn"
            >
              Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {/* Tile 1 */}
          <div className="tile">
            <h2>Connect IoT Device</h2>
            <p className="tile-description">
              Monitor your menopause journey <br/> with IoT-based sensor data
            </p>
            <button onClick={handleConnectDevice}>Connect Now</button>
          </div>

          {/* Tile 2 – Questionnaire */}
          <div className="tile questionnaire-tile">
            <h2>Predict Stage</h2>
            <p className="tile-description">
              Complete our questionnaire to help <br/> predict your current menopause stage
            </p>
            <button
              className="questionnaire-btn"
              onClick={handleOpenQuestionnaire}
            >
              Start
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
