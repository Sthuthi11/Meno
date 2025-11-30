import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./DeviceDetails.module.css";

const DeviceDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  //MOCK DATA
  const deviceData = location.state?.deviceData || {
    temperature: "36.8",
    heartRate: "78",
    sleepQuality: "Good",
    mood: "Happy",
  };

  return (
    <>
      {/* Full-width Header */}
      <header className={styles.header}>
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
        <button className={styles.menuBtn} onClick={() => navigate(-1)}>
          Back
        </button>
      </header>

      {/* Page Content */}
      <div className={styles.deviceDetailsPage}>
        <main className={styles.mainContent}>
          <div className={styles.tile}>
            <h2>Connected Device Data</h2>
            <p className={styles.tileDescription}>
              <strong>Temperature:</strong> {deviceData.temperature} °C
            </p>
            <p className={styles.tileDescription}>
              <strong>Heart Rate:</strong> {deviceData.heartRate} bpm
            </p>
            <p className={styles.tileDescription}>
              <strong>Sleep Quality:</strong> {deviceData.sleepQuality}
            </p>
            <p className={styles.tileDescription}>
              <strong>Mood:</strong> {deviceData.mood}
            </p>
          </div>
        </main>
      </div>
    </>
  );
};

export default DeviceDetails;
