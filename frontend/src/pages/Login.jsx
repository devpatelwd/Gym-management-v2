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
  const [error, setError] = useState("")

  async function getResponseData(res) {
    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error(data.detail || "Something went wrong")
    }

    return data
  }

  async function handleLogin() {
    if (!email.trim().includes("@")) {
      setError("Enter a valid email")
      return
    }

    if (password.trim() === "") {
      setError("Enter your password")
      return
    }

    setError("")

    try {
      const res = await fetch(`${BASE_URL}/user/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      const data = await getResponseData(res)

      if (!data.token) {
        throw new Error("Login token not received")
      }

      localStorage.setItem("token", data.token)

      const payload = JSON.parse(atob(data.token.split(".")[1]))

      if (payload.role === "user") {
        navigate("/dashboard")
      } else if (payload.role === "admin") {
        navigate("/admin-dashboard")
      } else {
        localStorage.removeItem("token")
        setError("Unsupported account role")
      }
    } catch (err) {
      localStorage.removeItem("token")
      setError(err.message || "Unable to login")
    }
  }

  async function handleForgotPassword() {
    if (!email.trim().includes("@")) {
      setError("Enter a valid email")
      return
    }

    setError("")

    try {
      const res = await fetch(`${BASE_URL}/user/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ "email": email.trim() })
      })

      await getResponseData(res)
      setOtp("")
      setPassword("")
      setStep(2)
    } catch (err) {
      setError(err.message || "Unable to send OTP")
    }
  }

  async function handleOtpVerify() {
    if (!/^\d{6}$/.test(otp.trim())) {
      setError("Enter the 6-digit OTP")
      return
    }

    setError("")

    try {
      const res = await fetch(`${BASE_URL}/user/verify-otp/`,{
        method : "POST",
        headers : {
          "Content-Type" : "application/json"
        },
        body : JSON.stringify({"email" : email.trim() , "otp" : otp.trim()})
      })

      await getResponseData(res)
      setStep(3)
    } catch (err) {
      setError(err.message || "Unable to verify OTP")
    }
  }

  async function handleSetPassword() {
    if (password.trim() === "") {
      setError("Enter a password")
      return
    }

    setError("")

    try {
      const res = await fetch(`${BASE_URL}/user/set-password/` , {
        method : "POST",
        headers : {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({"email" : email.trim() , "password" : password})
      })

      await getResponseData(res)
      setPassword("")
      setOtp("")
      setStep(0)
    } catch (err) {
      setError(err.message || "Unable to set password")
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
            {error && <p className="form-error">{error}</p>}

            <div className="field-group">
              <label className="field-label">Email</label>
              <input className="field-input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="field-group">
              <label className="field-label">Password</label>
              <input type="password" className="field-input" value={password} onChange={(e) => setPassword(e.target.value)} />
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
            {error && <p className="form-error">{error}</p>}

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
            {error && <p className="form-error">{error}</p>}

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
            {error && <p className="form-error">{error}</p>}

            <div className="field-group">
              <label className="field-label">Set password</label>
              <input type="password" className="field-input" value={password} onChange={(e) => setPassword(e.target.value)} />
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
