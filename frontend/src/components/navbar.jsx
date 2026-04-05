import { useNavigate } from "react-router-dom"
import gymlogo from "../assets/gymlogo.png"

export default function Navbar() {
  const token = localStorage.getItem("token")
  const navigate = useNavigate()

  function logout() {
    localStorage.removeItem("token")
    navigate("/")
  }

  return (
    <nav className="site-nav">
      <div className="brand-lockup">
        <img className="brand-logo" src={gymlogo} alt="logo"></img>
        <span className="brand-name">Kailash gym</span>
      </div>

      {token ? (
        <div className="nav-actions">
          <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>
          <button className="btn btn-danger" onClick={logout}>
            Logout
          </button>
        </div>
      ) : (
        <div className="nav-actions">
          <button className="btn btn-ghost" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/register")}>
            Register
          </button>
        </div>
      )}
    </nav>
  )
}
