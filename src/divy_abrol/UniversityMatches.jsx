import React, { useState } from "react";
import "./UniversityMatches.css"; 

export default function UniversityMatches() {
  const [show, setShow] = useState(false);
  
  // 👇 1. Inputs ki value store karne ke liye state
  const [year, setYear] = useState("");
  const [percentile, setPercentile] = useState("");
  const [score, setScore] = useState("");

  // 👇 2. Validation function jo khali form submit hone se rokega
  const handleShowColleges = () => {
    if (year === "" || score === "") {
      alert("Please fill the mandatory fields: Year of 12th and 12th Score!");
      return; // Agar khali hai, toh function yahi ruk jayega
    }
    setShow(true); // Agar sab bhara hai, tabhi output dikhega
  };

  return (
    <div className="main-matches"> {/* Changed class name slightly to avoid CSS conflicts */}
      <div className="uf">
        <h1>UNFILTERED U</h1>
      </div>

      <div className="form">
        <h2 style={{ color: "black" }}>Enter Your Details</h2>

        <label>Year of 12th</label>
        <input 
          type="number" 
          min="2000" max="2030" 
          placeholder="Enter year" 
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />

        <label>
          JEE Percentile <span>Optional</span>
        </label>
        <input 
          type="number" 
          min="0" max="100" 
          placeholder="Enter JEE percentile" 
          value={percentile}
          onChange={(e) => setPercentile(e.target.value)}
        />

        <label>
          12th Score <span>Mandatory</span>
        </label>
        <input 
          type="number" 
          min="0" max="100" 
          placeholder="Enter 12th score" 
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />

        {/* 👇 3. Yahan onClick par handleShowColleges lagaya hai */}
        <button onClick={handleShowColleges}>
          Show Colleges
        </button>
      </div>

      {show && (
        <div className="result">
          <h2 style={{color : "black"}}>Recommended Colleges</h2>
          <div className="grid">
            <div className="card">
              <img src="https://images.unsplash.com/photo-1564981797816-1043664bf78d" alt="IIT Delhi" />
              <h3>IIT Delhi</h3>
              <p>Percentile: 99.5+</p>
              <p>📍 New Delhi</p>
            </div>
            <div className="card">
              <img src="https://images.unsplash.com/photo-1562774053-701939374585" alt="IIT Bombay" />
              <h3>IIT Bombay</h3>
              <p>Percentile: 99.7+</p>
              <p>📍 Mumbai, Maharashtra</p>
            </div>
            <div className="card">
              <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f" alt="IIT Kanpur" />
              <h3>IIT Kanpur</h3>
              <p>Percentile: 99.4+</p>
              <p>📍 Kanpur, Uttar Pradesh</p>
            </div>
            <div className="card">
              <img src="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a" alt="IIT Kharagpur" />
              <h3>IIT Kharagpur</h3>
              <p>Percentile: 99.3+</p>
              <p>📍 Kharagpur, West Bengal</p>
            </div>
            <div className="card">
              <img src="https://images.unsplash.com/photo-1592280771190-3e2e4d571952" alt="IIT Roorkee" />
              <h3>IIT Roorkee</h3>
              <p>Percentile: 99.2+</p>
              <p>📍 Roorkee, Uttarakhand</p>
            </div>
            <div className="card">
              <img src="https://images.unsplash.com/photo-1580582932707-520aed937b7b" alt="NIT Trichy" />
              <h3>NIT Trichy</h3>
              <p>Percentile: 98.5+</p>
              <p>📍 Tiruchirappalli, Tamil Nadu</p>
            </div>
            <div className="card">
              <img src="https://images.unsplash.com/photo-1590012314607-cda9d9b699ae" alt="NIT Surathkal" />
              <h3>NIT Surathkal</h3>
              <p>Percentile: 98.3+</p>
              <p>📍 Surathkal, Karnataka</p>
            </div>
            <div className="card">
              <img src="https://images.unsplash.com/photo-1607237138185-eedd9c632b0b" alt="NIT Warangal" />
              <h3>NIT Warangal</h3>
              <p>Percentile: 98.1+</p>
              <p>📍 Warangal, Telangana</p>
            </div>
            <div className="card">
              <img src="https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?auto=format&fit=crop&w=800&q=80" alt="IIIT Hyderabad" />
              <h3>IIIT Hyderabad</h3>
              <p>Percentile: 97.8+</p>
              <p>📍 Hyderabad, Telangana</p>
            </div>
            <div className="card">
              <img src="https://images.unsplash.com/photo-1568792923760-d70635a89fdc" alt="DTU" />
              <h3>DTU</h3>
              <p>Percentile: 97.5+</p>
              <p>📍 New Delhi</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}