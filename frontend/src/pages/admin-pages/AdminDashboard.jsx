import { useEffect, useState } from "react"
import AdminNavbar from "../../components/AdminNavbar"
import { useNavigate } from "react-router-dom"
import { BASE_URL } from "../../config"

export default function AdminDashboard() {
  const [member, setMember] = useState(null)
  const [revenue, setRevenue] = useState(null)
  const [due, setDue] = useState(null)
  const token = localStorage.getItem("token")
  const [user, setUser] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate("/admin-login")
    }
    const payload = JSON.parse(atob(token.split(".")[1]))
    setUser(payload.role)

    if (payload.role === "user") {
      navigate("/login")
    }

    fetch(`${BASE_URL}/admin/stats`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMember(data.total_members)
        setRevenue(data.total_revenue)
        setDue(data.total_due)
      })
  }, [])

  return (
    <div className="site-shell admin-page">
      <AdminNavbar />

      <div className="page-shell">
        <div className="section-heading">
          <h1 className="section-title">Dashboard</h1>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h2 className="stat-label">Total Members</h2>
            <p className="stat-value">{member}</p>
          </div>

          <div className="stat-card">
            <h2 className="stat-label">Total Revenue</h2>
            <p className="stat-value">{revenue}</p>
          </div>

          <div className="stat-card">
            <h2 className="stat-label">Total Due</h2>
            <p className="stat-value">{due}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
