import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { BASE_URL } from "../../config"
import Navbar from "../../components/navbar"

export default function Register() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const [error, setError] = useState("")

  function handleRegister() {
    if (name === "") {
      setError("Enter a valid name ")
      return
    }

    setError("")
    if (phone.length != 10) {
      setError("Enter a valid phone Number")
      return
    }

    if (!email.includes("@")) {
      setError("Enter a valid Email ")
      return
    }

    fetch(`${BASE_URL}/user/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, email }),
    })
      .then((res) => res.json())
      .then(() => setStep(2))
  }

  function handleVerifyOtp() {
    fetch(`${BASE_URL}/user/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp, email }),
    })
      .then((res) => res.json())
      .then(() => setStep(3))
  }

  function handleSetPassword() {
    fetch(`${BASE_URL}/user/set-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then(() => navigate("/login"))
  }

  return (
    <div className="site-shell">
      <Navbar />

      {step === 1 && (
        <div className="auth-page">
          <div className="auth-card">
            <h1 className="auth-title">Register</h1>
            {error && <p className="form-error">{error}</p>}

            <div className="field-group">
              <label className="field-label">Full Name</label>
              <input className="field-input" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="field-group">
              <label className="field-label">Mobile No.</label>
              <input className="field-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            <div className="field-group">
              <label className="field-label">Email</label>
              <input className="field-input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="auth-actions">
              <button className="btn btn-primary" onClick={handleRegister}>
                Get OTP
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="auth-page">
          <div className="auth-card">
            <div className="field-group">
              <label className="field-label">Enter OTP</label>
              <input className="field-input" value={otp} onChange={(e) => setOtp(e.target.value)} />
            </div>

            <div className="auth-actions">
              <button className="btn btn-primary" onClick={handleVerifyOtp}>
                Verify OTP
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="auth-page">
          <div className="auth-card">
            <div className="field-group">
              <label className="field-label">Enter Password</label>
              <input className="field-input" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className="auth-actions">
              <button className="btn btn-primary" onClick={handleSetPassword}>
                Set Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
