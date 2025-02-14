import React, { useState, useEffect } from "react";
import { auth } from "../firebase/firebaseConfig"; // Import your Firebase auth instance
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState(""); // Email state
  const [password, setPassword] = useState(""); // Password state
  const navigate = useNavigate();
  const [audioContextInitialized, setAudioContextInitialized] = useState(false);

  // Load sound files
  const loginOpenSound = new Audio(process.env.PUBLIC_URL + "/sounds/login-open.mp3");
  const typingSound = new Audio(process.env.PUBLIC_URL + "/sounds/typing.mp3");
  const loginSuccessSound = new Audio(process.env.PUBLIC_URL + "/sounds/login-success.wav");

  // Initialize sounds after first user interaction
  const initializeAudioContext = () => {
    if (!audioContextInitialized) {
      loginOpenSound.play();
      setAudioContextInitialized(true);
    }
  };

  // Play sound on typing
  const handleTyping = (setter, value) => {
    if (audioContextInitialized) {
      typingSound.play();
    }
    setter(value);
  };

  // Handle Login
  const handleLogin = () => {
    initializeAudioContext();

    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    // Firebase Authentication
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("User logged in:", userCredential.user);
        loginSuccessSound.play(); 
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Error during login:", error.message);
        alert("Login failed. Please check your credentials.");
      });
  };

  return (
    <div className="boxoffice" onClick={initializeAudioContext}>
      <div className="login-container">
        <h1>School Data Base</h1>
        <h2>Login</h2>

        {/* Email Input */}
        <div className="input-container">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => handleTyping(setEmail, e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        {/* Password Input */}
        <div className="input-container">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => handleTyping(setPassword, e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        {/* Login Button */}
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Login;
