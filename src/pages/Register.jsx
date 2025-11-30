// pages/Register.jsx - Fixed version
import React, { useEffect, useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, signInWithGoogle } from "../firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Full Name is required!");
      return;
    }
    if (!email.trim()) {
      toast.error("Email is required!");
      return;
    }
    if (!password) {
      toast.error("Password is required!");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }

    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredentials.user;
      
      // Save user data to Firestore
      await setDoc(doc(db, "users", newUser.uid), {
        uid: newUser.uid,
        email: newUser.email,
        firstName: fullName.split(" ")[0] || "",
        lastName: fullName.split(" ")[1] || "",
        img: "",
        createdAt: new Date().toISOString(),
      });

      console.log("User registered & saved to Firestore");
      
      // Clear form fields
      setFullName("");
      setEmail("");
      setPassword("");
      
      toast.success("Registration successful!");
      
    } catch (err) {
      console.error("Registration error:", err);
      switch (err.code) {
        case "auth/email-already-in-use":
          toast.error("Email already registered. Please login instead.");
          break;
        case "auth/invalid-email":
          toast.error("Invalid email format!");
          break;
        case "auth/weak-password":
          toast.error("Password is too weak. Use at least 6 characters.");
          break;
        case "auth/operation-not-allowed":
          toast.error("Email registration is not enabled!");
          break;
        default:
          toast.error("Registration failed. Please try again.");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // Add loading toast for better UX
      const loadingToast = toast.loading("Signing up with Google...");
      
      await signInWithGoogle();
      
      toast.dismiss(loadingToast);
      toast.success("Google registration successful!");
    } catch (error) {
      toast.dismiss(); // Remove any loading toasts
      console.error("Google sign-in error:", error);
      
      if (error.code === "auth/popup-closed-by-user") {
        toast.error("Sign-up cancelled");
      } else if (error.code === "auth/popup-blocked") {
        toast.error("Popup blocked. Please allow popups and try again.");
      } else if (error.code === "auth/cancelled-popup-request") {
        // Don't show error for this, user likely clicked multiple times
        return;
      } else {
        toast.error("Google sign-up failed. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (loading) return;
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    
    <div className="max-w-[100%] mx-auto">
      <div className="flex items-center justify-center mt-8 mb-4">
        {/* Menopause logo (small) */}
        <img
          src="https://cdn-icons-gif.flaticon.com/11290/11290536.gif"
          alt="MenoSense Logo"
          className="w-12 h-12 mr-3"
        />

        {/* BIGGER title */}
        <h1 className="text-5xl font-extrabold text-purple-600 tracking-wide drop-shadow-lg">
          MenoSense
        </h1>
      </div>
      <br></br>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center"
      >
        <label className="relative">
  <input
    type="text"
    value={fullName}
    onChange={(e) => setFullName(e.target.value)}
    className="my-2 mx-1 w-[220px] xs:w-[280px] md:w-[320px] px-4 py-2.5 rounded-full 
               outline-none border border-gray-400 focus:border-purple-500 
               transition duration-200 text-sm bg-white text-black"
  />
  <span className="absolute top-3.5 left-0 mx-5 px-2 bg-white text-gray-500 
                   transition duration-300 input-text text-sm">
    {fullName ? "" : "Full Name"}
  </span>
</label>

<label className="relative">
  <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="my-2 mx-1 w-[220px] xs:w-[280px] md:w-[320px] px-4 py-2.5 rounded-full 
               outline-none border border-gray-400 focus:border-purple-500 
               transition duration-200 text-sm bg-white text-black"
  />
  <span className="absolute top-3.5 left-0 mx-5 px-2 bg-white text-gray-500 
                   transition duration-300 input-text text-sm">
    {email ? "" : "Email"}
  </span>
</label>

<label className="relative">
  <input
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="my-2 mx-1 w-[220px] xs:w-[280px] md:w-[320px] px-4 py-2.5 rounded-full 
               outline-none border border-gray-400 focus:border-purple-500 
               transition duration-200 text-sm bg-white text-black"
  />
  <span className="absolute top-3.5 left-0 mx-5 px-2 bg-white text-gray-500 
                   transition duration-300 input-text text-sm">
    {password ? "" : "Password"}
  </span>
</label>

<button
  type="submit"
  disabled={loading}
  className="w-[220px] xs:w-[280px] md:w-[320px] bg-purple-600 
             hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed 
             py-2 text-white text-sm rounded-full mt-4 transition duration-200"
>
  {loading ? "Registering..." : "Register"}
</button>
</form>

<div className="flex items-center justify-center mt-3 text-gray-500 text-xs">
  <div className="border w-[80px] border-gray-300 mr-1" />
  OR
  <div className="border w-[80px] border-gray-300 ml-1"></div>
</div>

<div className="flex flex-col items-center mt-3">
  <button
    type="button"
    onClick={handleGoogleSignIn}
    disabled={loading}
    className="w-[220px] xs:w-[280px] md:w-[320px] bg-gray-100 hover:bg-gray-200 
               disabled:bg-gray-50 disabled:cursor-not-allowed text-black text-sm 
               font-medium rounded-full py-2 flex items-center justify-center 
               transition duration-200"
  >
    <img
      src="https://cdn-icons-png.flaticon.com/128/2991/2991148.png"
      alt="Google"
      className="h-[20px] md:h-[22px] mr-[6px]"
    />
    {loading ? "Signing up..." : "Sign up with Google"}
  </button>

  <div className="text-slate-600 mt-2 mb-3 text-xs">
    Already have an account?{" "}
    <Link to="/login">
      <span className="text-purple-500 font-medium">Login</span>
    </Link>
  </div>
</div>

<ToastContainer 
  position="top-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
/>

    </div>
  );
};

export default Register;