import { useEffect, useState } from "react"
import AdminNavbar from "../../components/AdminNavbar"
import { BASE_URL } from "../../config"
import { useNavigate } from "react-router-dom"

export default function AdminPlans() {
  const [plans, setPlans] = useState([])
  const [selectedplan, setSelectedplan] = useState({
    plan_id: 0,
    plan_price: 0,
  })
  const [showmodal, setShowmodal] = useState(false)
  const token = localStorage.getItem("token")
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate("/admin-login")
    }

    const payload = JSON.parse(atob(token.split(".")[1]))

    if (payload.role === "user") {
      navigate("/login")
    }

    fetchPlans()
  }, [])

  async function handleSaveModal(id) {
    await fetch(`${BASE_URL}/admin/plans-price/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ plan_price: selectedplan.plan_price }),
    })

    setShowmodal(false)
    fetchPlans()
  }

  function fetchPlans() {
    fetch(`${BASE_URL}/plans/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setPlans(data))
  }

  return (
    <div className="site-shell admin-page">
      <AdminNavbar />

      <div className="page-shell">
        <div className="toolbar">
          <button className="btn btn-primary" onClick={() => setShowmodal(true)}>
            Update Price
          </button>
        </div>

        {showmodal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-form">
                <div className="field-group">
                  <label className="field-label">Select Plan</label>
                  <select
                    className="field-select"
                    value={selectedplan.plan_id}
                    onChange={(e) => setSelectedplan({ ...selectedplan, plan_id: e.target.value })}
                  >
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.plan}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field-group">
                  <label className="field-label">Price</label>
                  <input
                    className="field-input"
                    value={selectedplan.plan_price}
                    onChange={(e) => setSelectedplan({ ...selectedplan, plan_price: e.target.value })}
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    className="btn border border-slate-300 bg-slate-100 text-slate-700 shadow-none"
                    onClick={() => setShowmodal(false)}
                  >
                    Close
                  </button>
                  <button className="btn btn-primary" onClick={() => handleSaveModal(selectedplan.plan_id)}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="table-card">
          <div className="table-scroll">
            <table className="data-table responsive-table">
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Month</th>
                  <th>Price</th>
                </tr>
              </thead>

              <tbody>
                {plans.map((plan) => (
                  <tr key={plan.id}>
                    <td data-label="Plan">{plan.plan}</td>
                    <td data-label="Month">{plan.months}</td>
                    <td data-label="Price">{plan.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
