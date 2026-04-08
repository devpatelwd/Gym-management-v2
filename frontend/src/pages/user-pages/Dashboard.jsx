import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../../components/navbar"
import { BASE_URL } from "../../config"

export default function Dashboard() {
  const token = localStorage.getItem("token")
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [enrollment, setEnrollment] = useState(null)
  const [isFetchingEnrollment, setIsFetchingEnrollment] = useState(true)

  useEffect(() => {
    if (!token) {
      navigate("/login")
    }

    const payload = JSON.parse(atob(token.split(".")[1]))
    setUser(payload)

    if (payload.role === "admin") {
      navigate("/login")
    }

    fetch(`${BASE_URL}/user/enrollment-status/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setEnrollment(data.detail ? null : data))
      .finally(() => setIsFetchingEnrollment(false))
  }, [])

  return (
    <div className="site-shell">
      <Navbar />

      <div className="page-shell">
        <div className="dashboard-card">
          <h1 className="dashboard-title">Welcome , {user?.name}</h1>
          <p className="dashboard-meta">{user?.email}</p>

          {isFetchingEnrollment && (
            <div className="empty-state">
              <div className="empty-copy">Fetching request...</div>
            </div>
          )}

          {!isFetchingEnrollment && enrollment === null && (
            <div className="empty-state">
              <div className="empty-copy">No Enrollment yet</div>
              <button className="btn btn-primary" onClick={() => navigate("/enroll")}>
                Enroll Now
              </button>
            </div>
          )}

          {enrollment?.request_status === "Pending" && <div className="status-pill status-pending">Request Pending</div>}
          {enrollment?.request_status === "Approved" && <div className="status-pill status-active">Active Member</div>}
          {enrollment?.request_status === "Rejected" && (
            <div className="status-pill status-rejected">Rejected by Admin</div>
          )}

        </div>
      </div>
    </div>
    
  )
}
