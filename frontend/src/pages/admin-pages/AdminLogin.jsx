import { useState } from "react"
import AdminNavbar from "../../components/AdminNavbar"
import { useNavigate } from "react-router-dom"
import { BASE_URL } from "../../config"
import useActionLock from "../../hooks/useActionLock"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { isLocked, runLocked } = useActionLock()

  async function handleAdminLogin() {
    const res = await fetch(`${BASE_URL}/admin/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()
    localStorage.setItem("token", data.token)

    navigate("/admin-dashboard")
  }

  return (
    <div className="site-shell admin-page">
      <AdminNavbar />

      <div className="auth-page">
        <div className="auth-card">
          <h1 className="auth-title">Admin Login</h1>

          <div className="field-group">
            <label className="field-label">Email</label>
            <input className="field-input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="field-group">
            <label className="field-label">Password</label>
            <input className="field-input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="auth-actions">
            <button
              className="btn btn-primary"
              onClick={() => runLocked("adminLogin", handleAdminLogin)}
              disabled={isLocked("adminLogin")}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
