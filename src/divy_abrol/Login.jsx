import React, { useState } from 'react';
import './Login.css';

export default function Login({ onLogin }) {
  const [userType, setUserType] = useState("fresher");

  // 👇 1. YAHAN CHANGE KIYA: Inputs ka data save karne ke liye state variables banaye
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");

  const handleLoginClick = (e) => {
    e.preventDefault();
    
    // 👇 2. YAHAN CHANGE KIYA: Login button dabne par ye details App.jsx ko bhej di
    onLogin({ 
      name: name, 
      email: email, 
      university: university || "Not Provided" 
    }); 
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-left">
        <div className="login-form-container">
          <h1 className="mobile-brand">Unfiltered U</h1>
          
          <div className="mh">Welcome Back!</div>
          <div className="sh">Login to continue</div>

          <div className="typeButtons">
            <button
              className={userType === "fresher" ? "typeBtn active" : "typeBtn"}
              onClick={() => setUserType("fresher")}
            >
              Fresher
            </button>
            <button
              className={userType === "senior" ? "typeBtn active" : "typeBtn"}
              onClick={() => setUserType("senior")}
            >
              Senior
            </button>
          </div>

          <div className="form">
            <label>Enter Your Name</label>
            {/* 👇 3. Inputs ko state ke sath connect kiya */}
            <input 
              type="text" 
              placeholder="Enter your name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label>Enter Email</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {userType === "senior" && (
              <>
                <label>College Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your college/university name" 
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                />

                <label>Branch</label>
                <input type="text" placeholder="Branch" />

                <label>Semester</label>
                <input type="number" min="1" max="8" placeholder="Enter your semester" />
              </>
            )}

            <div className="forgot">Forgot Password?</div>

            <button className="loginb" onClick={handleLoginClick}>
              Login
            </button>

            <div className="or">OR</div>

            <div className="social">
              <button aria-label="Google">
                <img src="https://img.icons8.com/color/48/google-logo.png" alt="Google" width="24" height="24" />
              </button>
              <button aria-label="Twitter">
                <img src="https://img.icons8.com/ios-filled/50/twitterx--v1.png" alt="Twitter" width="22" height="22" />
              </button>
              <button aria-label="Facebook">
                <img src="https://img.icons8.com/color/48/facebook-new.png" alt="Facebook" width="26" height="26" />
              </button>
            </div>

            <div className="signup">
              Don't have an account? <span>Sign Up</span>
            </div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="right-content">
          <h2>Unfiltered U</h2>
          <p>Discover your perfect hostel and track accurate cutoff trends effortlessly.</p>
        </div>
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
      </div>
    </div>
  );
}