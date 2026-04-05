import { useEffect, useState } from "react"
import AdminNavbar from "../../components/AdminNavbar"
import { BASE_URL } from "../../config"

export default function AdminRequests() {
  const [requests, setRequests] = useState([])
  const token = localStorage.getItem("token")
  const [showrequestmodel, setShowRequestModel] = useState(false)
  const [selected_request, setSelected_request] = useState({})
  const [loading, setLoading] = useState(false)
  const [approveformdata, setApproveformdata] = useState({
    status: "",
    gender: "Male",
    joining_date: new Date().toISOString().split("T")[0],
    subs_end_date: "",
    plan_amount: 0,
    amount_paid: 0,
    status_member: "Paid",
  })
  const [rejected, setRejected] = useState("Rejected")

  useEffect(() => {
    fetchRequests()
  }, [])

  async function fetchRequests() {
    const res = await fetch(`${BASE_URL}/admin/requests`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await res.json()
    setRequests(data.all_request)
  }

  function handleApproveButton(request, price) {
    setSelected_request(request)
    const endDate = new Date(approveformdata.joining_date)
    endDate.setMonth(endDate.getMonth() + request.plan.months)
    const subs_end_date = endDate.toISOString().split("T")[0]
    setApproveformdata({ ...approveformdata, status: "Approved", subs_end_date: subs_end_date, plan_amount: price })

    setShowRequestModel(true)
    fetchRequests()
  }

  async function handleApproveSubmit(id) {
    setLoading(true)
    await fetch(`${BASE_URL}/admin/update-req-status/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(approveformdata),
    })

    setShowRequestModel(false)
    fetchRequests()
    setLoading(false)
  }

  async function handleRejectBtn(id) {
    await fetch(`${BASE_URL}/admin/update-req-status/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: rejected }),
    })
    fetchRequests()
  }

  return (
    <div className="site-shell admin-page">
      <AdminNavbar />

      <div className="page-shell">
        {showrequestmodel && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-form modal-grid">
                <div className="field-group">
                  <label className="field-label">Gender</label>
                  <select
                    className="field-select"
                    value={approveformdata.gender}
                    onChange={(e) => setApproveformdata({ ...approveformdata, gender: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="field-group">
                  <label className="field-label">Joining Date</label>
                  <input
                    className="field-input"
                    type="date"
                    value={approveformdata.joining_date}
                    onChange={(e) => setApproveformdata({ ...approveformdata, joining_date: e.target.value })}
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Ending Date</label>
                  <input className="field-input" type="date" value={approveformdata.subs_end_date} />
                </div>

                <div className="field-group">
                  <label className="field-label">Status</label>
                  <select
                    className="field-select"
                    value={approveformdata.status_member}
                    onChange={(e) => setApproveformdata({ ...approveformdata, status_member: e.target.value })}
                  >
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
                </div>

                <div className="field-group">
                  <label className="field-label">Plan Amount</label>
                  <input
                    className="field-input"
                    value={approveformdata.plan_amount}
                    onChange={(e) => setApproveformdata({ ...approveformdata, plan_amount: e.target.value })}
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Amount Paid</label>
                  <input
                    className="field-input"
                    value={approveformdata.amount_paid}
                    onChange={(e) => setApproveformdata({ ...approveformdata, amount_paid: e.target.value })}
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    className="btn border border-slate-300 bg-slate-100 text-slate-700 shadow-none"
                    onClick={() => setShowRequestModel(false)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={() => handleApproveSubmit(selected_request.id)} disabled={loading}>
                    Approve
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
                  <th>Email</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Coupen</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td data-label="Email">{request.email}</td>
                    <td data-label="Plan">{request.plan.plan}</td>
                    <td data-label="Status">{request.status}</td>
                    <td data-label="Coupen">{request.coupen}</td>
                    <td data-label="Actions" className="cell-actions">
                      <button
                        className="btn btn-secondary table-inline-action"
                        onClick={() => handleApproveButton(request, request.plan.price)}
                      >
                        Approve
                      </button>
                      <button className="btn btn-danger table-inline-action" onClick={() => handleRejectBtn(request.id)}>
                        Reject
                      </button>
                    </td>
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
