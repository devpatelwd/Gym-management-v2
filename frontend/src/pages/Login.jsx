import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/navbar"
import { BASE_URL } from "../config"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

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

  return (
    <div className="site-shell">
      <Navbar />

      <div className="auth-page">
        <div className="auth-card">
          <h1 className="auth-title">Login</h1>

          <div className="field-group">
            <label className="field-label">Email</label>
            <input className="field-input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="field-group">
            <label className="field-label">Password</label>
            <input className="field-input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="auth-actions">
            <button className="btn btn-primary" onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
