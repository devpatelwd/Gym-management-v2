import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/navbar"
import { BASE_URL } from "../config"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [otp , setOtp] = useState("")

  async function handleLogin() {
    const res = await fetch(`${BASE_URL}/user/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()
    localStorage.setItem("token", data.token)

    const payload = JSON.parse(atob(data.token.split(".")[1]))

    if (payload.role === "user") {
      navigate("/dashboard")
    } else if (payload.role === "admin") {
      navigate("/admin-dashboard")
    } else {
      navigate("/login")
    }
  }

  async function handleForgotPassword() {
    const res = await fetch(`${BASE_URL}/user/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ "email": email })
    })

    const data = await res.json()
    if (res.ok) {
      setStep(2)
    }
  }

  async function handleOtpVerify() {
    const res = await fetch(`${BASE_URL}/user/verify-otp`,{
      method : "POST",
      headers : {
        "Content-type" : "application/json"
      },
      body : JSON.stringify({"email" : email , "otp" : otp})
    })

    const data = await res.json()

    if (res.ok){
      setStep(3)
    }
  }

  async function handleSetPassword() {
    const res = await fetch(`${BASE_URL}/user/set-password` , {
      method : "POST",
      headers : {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({"email" : email , "password" : password})
    })


    if (res.ok){

      setPassword("")
      setStep(0)
    }
  }

  return (
    <div className="site-shell">
      <Navbar />

      {step === 0 &&
        <div className="auth-page">
          <div className="auth-card login-auth-card">
            <h1 className="auth-title">Login</h1>
            <p className="login-auth-note">Sign in to continue to your dashboard.</p>

            <div className="field-group">
              <label className="field-label">Email</label>
              <input className="field-input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="field-group">
              <label className="field-label">Password</label>
              <input className="field-input" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className="auth-actions login-auth-actions">
              <button className="btn btn-primary" onClick={handleLogin}>
                Login
              </button>

              <span className="login-auth-link" onClick={() => setStep(1)}>Forgot Password?</span>
            </div>
          </div>
        </div>
      }

      {step === 1 && (
        <div className="auth-page">
          <div className="auth-card login-auth-card">
            <h1 className="auth-title">Forgot Password</h1>
            <p className="login-auth-note">Enter your email to receive a OTP.</p>

            <div className="field-group">
              <label className="field-label">Email</label>
              <input className="field-input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="auth-actions login-auth-actions">
              <button className="btn btn-primary" onClick={() => handleForgotPassword()}>
                Get Otp
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="auth-page">
          <div className="auth-card login-auth-card">
            <h1 className="auth-title">Verify OTP</h1>
            <p className="login-auth-note">Enter the OTP sent to your email address.</p>

            <div className="field-group">
              <label className="field-label">Otp</label>
              <input className="field-input" value={otp} onChange={(e) => setOtp(e.target.value)} />
            </div>

            <div className="auth-actions login-auth-actions">
              <button className="btn btn-primary" onClick={() => handleOtpVerify()}>
                Verify otp
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="auth-page">
          <div className="auth-card login-auth-card">
            <h1 className="auth-title">Set Password</h1>
            <p className="login-auth-note">Choose your new password to complete recovery.</p>

            <div className="field-group">
              <label className="field-label">Set password</label>
              <input className="field-input" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className="auth-actions login-auth-actions">
              <button className="btn btn-primary" onClick={() => handleSetPassword()}>
                Set Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

  )
}
