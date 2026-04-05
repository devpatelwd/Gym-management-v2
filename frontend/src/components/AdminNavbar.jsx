import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import gymlogo from "../assets/gymlogo.png"

const adminLinks = [
  { to: "/admin-dashboard", label: "Dashboard" },
  { to: "/admin-members", label: "Members" },
  { to: "/admin-plans", label: "Plans" },
  { to: "/admin-request", label: "Requests" },
  { to: "/admin-coupens", label: "Coupens" },
]

export default function AdminNavbar() {
  const token = localStorage.getItem("token")
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 900) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (!sidebarOpen) {
      document.body.style.overflow = ""
      return
    }

    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = ""
    }
  }, [sidebarOpen])

  function logout() {
    localStorage.removeItem("token")
    setSidebarOpen(false)
    navigate("/")
  }

  function closeSidebar() {
    setSidebarOpen(false)
  }

  if (!token) {
    return (
      <nav className="site-nav">
        <div className="brand-lockup">
          <img className="brand-logo" src={gymlogo} alt="logo"></img>
          <span className="brand-name">Kailash gym</span>
        </div>

        <button className="btn btn-primary" onClick={() => navigate("/admin-login")}>
          Login
        </button>
      </nav>
    )
  }

  return (
    <>
      <header className="admin-mobile-topbar">
        <div className="brand-lockup">
          <img className="brand-logo" src={gymlogo} alt="logo"></img>
          <span className="brand-name">Kailash gym</span>
        </div>

        <button
          className={`admin-menu-toggle ${sidebarOpen ? "is-open" : ""}`}
          type="button"
          aria-label={sidebarOpen ? "Close admin menu" : "Open admin menu"}
          aria-expanded={sidebarOpen}
          onClick={() => setSidebarOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      <button
        className={`admin-sidebar-backdrop ${sidebarOpen ? "is-open" : ""}`}
        type="button"
        aria-label="Close admin sidebar"
        onClick={closeSidebar}
      ></button>

      <aside className={`admin-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="admin-sidebar-head">
          <div className="brand-lockup admin-sidebar-brand">
            <img className="brand-logo" src={gymlogo} alt="logo"></img>
            <span className="brand-name">Kailash gym</span>
          </div>

          <button
            className="admin-sidebar-close"
            type="button"
            aria-label="Close admin menu"
            onClick={closeSidebar}
          >
            Close
          </button>
        </div>

        <div className="admin-sidebar-copy">
          <p className="admin-sidebar-kicker">Admin Panel</p>
          <p className="admin-sidebar-text">Manage members, plans, requests, and offers from one place.</p>
        </div>

        <nav className="admin-sidebar-nav">
          {adminLinks.map((link) => (
            <Link
              key={link.to}
              className={`admin-sidebar-link ${location.pathname === link.to ? "is-active" : ""}`}
              to={link.to}
              onClick={closeSidebar}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button className="btn btn-danger admin-sidebar-logout" onClick={logout}>
          Logout
        </button>
      </aside>
    </>
  )
}
