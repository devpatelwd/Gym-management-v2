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

  async function getResponseData(res) {
    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error(data.detail || "Something went wrong")
    }

    return data
  }

  async function handleRegister() {
    if (name.trim() === "") {
      setError("Enter a valid name ")
      return
    }

    setError("")
    if (!/^\d{10}$/.test(phone.trim())) {
      setError("Enter a valid phone Number")
      return
    }

    if (!email.trim().includes("@")) {
      setError("Enter a valid Email ")
      return
    }

    try {
      const res = await fetch(`${BASE_URL}/user/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim(), email: email.trim() }),
      })

      await getResponseData(res)
      setOtp("")
      setPassword("")
      setStep(2)
    } catch (err) {
      setError(err.message || "Unable to register")
    }
  }

  async function handleVerifyOtp() {
    if (!/^\d{6}$/.test(otp.trim())) {
      setError("Enter the 6-digit OTP")
      return
    }

    setError("")

    try {
      const res = await fetch(`${BASE_URL}/user/verify-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: otp.trim(), email: email.trim() }),
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
      const res = await fetch(`${BASE_URL}/user/set-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      await getResponseData(res)
      navigate("/login")
    } catch (err) {
      setError(err.message || "Unable to set password")
    }
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
              {error && <p className="form-error">{error}</p>}
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
              {error && <p className="form-error">{error}</p>}
              <label className="field-label">Enter Password</label>
              <input type="password" className="field-input" value={password} onChange={(e) => setPassword(e.target.value)} />
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
