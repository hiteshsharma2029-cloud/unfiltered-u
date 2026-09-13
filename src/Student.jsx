import { useState } from 'react'
import './p.css'

function App() {
  const [userType, setUserType] = useState("fresher")

  return (
    <div className="main">

      <div className="uf">
        Unfiltered U
      </div>

      <div className="login">

        <div className="mh">
          Welcome Back!
        </div>

        <div className="sh">
          Login to continue
        </div>

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
          <input
            type="text"
            placeholder="Enter your name"
          />

          <label>Enter Email</label>
          <input
            type="email"
            placeholder="Enter your email"
          />

          {userType === "fresher" ? (
            <>
            </>
          ) : (
            <>
              <label>College Name</label>
              <input
                type="text"
                placeholder="Enter your college/university name"
              />

              <label>Branch</label>
              <input
                type="text"
                placeholder="Branch"
              />
              <label></label>
              <input type="number" min="1" max="8" placeholder="Enter your semester"/>
            </>
          )}

          <div className="forgot">
            Forgot Password?
          </div>

          <button className="loginb">
            Login
          </button>

          <div className="or">
            OR
          </div>

          <div className="social">
            <button>G</button>
            <button>GH</button>
            <button>in</button>
          </div>

          <div className="signup">
            Don't have an account?
            <span> Sign Up</span>
          </div>

        </div>

      </div>
    </div>
  )
}

export default App