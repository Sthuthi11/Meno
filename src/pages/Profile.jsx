import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout } from "../firebase";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./Profile.css";

const Profile = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [age, setAge] = useState("");
  const [profession, setProfession] = useState("");

  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      if (!user) return;

      const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user.email
      )}&background=7c3aed&color=fff`;

      let baseName = user.displayName || "";
      let basePhoto = user.photoURL || fallbackAvatar;

      setDisplayName(baseName);
      setPreviewUrl(basePhoto);

      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const data = snap.data();
          if (data.displayName) setDisplayName(data.displayName);
          if (data.img) setPreviewUrl(data.img);
          if (data.age) setAge(String(data.age));
          if (data.profession) setProfession(data.profession);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (!loading) loadProfile();
  }, [user, loading, navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setStatusMsg("");

    try {
      const finalDisplayName = displayName.trim() || user.email;

      await updateProfile(user, {
        displayName: finalDisplayName,
        photoURL: previewUrl,
      });

      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          email: user.email,
          displayName: finalDisplayName,
          img: previewUrl,
          age: age ? Number(age) : null,
          profession,
        },
        { merge: true }
      );

      await user.reload();
      setStatusMsg("Changes saved successfully.");
      setTimeout(() => setStatusMsg(""), 2000);
    } catch (err) {
      console.error(err);
      setStatusMsg("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) return null;

  return (
    <>
        <header className="profile-header-bar">
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
    <div className="header-actions">
    <button className="profile-menuBtn" onClick={() => navigate(-1)}>
      Back
    </button>
    <button className="profile-menuBtn logoutBtn" onClick={logout}>
      Logout
    </button>
    </div>
      </header>


      <div className="profile-page">

        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar-wrapper">
              {previewUrl ? (
                <img src={previewUrl} alt="Profile" className="profile-avatar" />
              ) : (
                <div className="profile-avatar-letter">
                  { (displayName?.charAt(0) || user.email.charAt(0)).toUpperCase() }
                </div>
              )}
            </div>

            <div className="profile-header-text">
              <h1>{displayName || user.email.split("@")[0]}</h1>
              <p className="profile-email">{user.email}</p>
            </div>
          </div>

          {/* FORM */}
          <form className="profile-form" onSubmit={handleSave}>
            <div className="profile-field">
              <label>Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            <div className="profile-readonly">
              <label>Email</label>
              <div className="profile-readonly-box">{user.email}</div>
            </div>

            <div className="profile-row">
              <div className="profile-field">
                <label>Age</label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>

              <div className="profile-field">
                <label>Profession</label>
                <select
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Housewife">Housewife</option>
                  <option value="IT">IT</option>
                  <option value="Lecturer">Lecturer</option>
                  <option value="Part-time worker">Part-time worker</option>
                  <option value="Private shops and business">
                    Private shops and business
                  </option>
                  <option value="Doctor">Doctor</option>
                  <option value="Employee">Employee</option>
                  <option value="Other (Student)">Other (Student)</option>
                </select>
              </div>
            </div>

            <div className="profile-actions">
              <button
                type="submit"
                className="profile-btn-primary"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

            {statusMsg && (
              <p
                className={
                  statusMsg.includes("success")
                    ? "profile-success"
                    : "profile-error"
                }
              >
                {statusMsg}
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;
