import { useEffect, useState } from "react"
import AdminNavbar from "../../components/AdminNavbar"
import ConfirmDialog from "../../components/ConfirmDialog"
import { BASE_URL } from "../../config"
import { useNavigate } from "react-router-dom"

export default function AdminCoupen() {
  const [coupens, setCoupens] = useState([])
  const token = localStorage.getItem("token")
  const navigate = useNavigate()
  const [showcoupenmodel, setShowCoupenModel] = useState(false)
  const [coupenToDelete, setCoupenToDelete] = useState(null)
  const [coupendata, setCoupenData] = useState({
    coupen_code: "",
    discount_amount: 0,
    discount_percentage: 0,
    total_uses: 0,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      navigate("/admin-login")
    }

    const payload = JSON.parse(atob(token.split(".")[1]))

    if (payload.role === "user") {
      navigate("/login")
    }

    fetchCoupens()
  }, [])

  async function fetchCoupens() {
    const res = await fetch(`${BASE_URL}/admin/get-coupens`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await res.json()
    console.log(data)
    setCoupens(data.all_coupens)
  }

  async function handleAddCoupen() {
    setLoading(true)
    await fetch(`${BASE_URL}/admin/add-coupens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(coupendata),
    })

    fetchCoupens()
    setShowCoupenModel(false)
    setLoading(false)
  }

  async function handleDeleteCoupen() {
    if (!coupenToDelete) {
      return
    }

    await fetch(`${BASE_URL}/admin/delete-coupen/${coupenToDelete.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    fetchCoupens()
    setCoupenToDelete(null)
  }

  return (
    <div className="site-shell admin-page">
      <AdminNavbar />
      <ConfirmDialog
        open={Boolean(coupenToDelete)}
        title="Delete coupen?"
        message={`This will permanently remove ${coupenToDelete?.coupen_code ?? "this coupen"} from the system.`}
        confirmLabel="Delete Coupen"
        cancelLabel="Keep Coupen"
        onConfirm={handleDeleteCoupen}
        onCancel={() => setCoupenToDelete(null)}
      />

      <div className="page-shell">
        <div className="toolbar">
          <button className="btn btn-primary" onClick={() => setShowCoupenModel(true)}>
            Add Coupen
          </button>
        </div>

        {showcoupenmodel && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-form modal-grid">
                <div className="field-group">
                  <label className="field-label">Coupen Code</label>
                  <input
                    className="field-input"
                    value={coupendata.coupen_code}
                    onChange={(e) => setCoupenData({ ...coupendata, coupen_code: e.target.value })}
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Discount Amount</label>
                  <input
                    className="field-input"
                    value={coupendata.discount_amount}
                    onChange={(e) => setCoupenData({ ...coupendata, discount_amount: e.target.value })}
                  ></input>
                </div>

                <div className="field-group">
                  <label className="field-label">Discount Percentage</label>
                  <input
                    className="field-input"
                    value={coupendata.discount_percentage}
                    onChange={(e) => setCoupenData({ ...coupendata, discount_percentage: e.target.value })}
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Total Uses</label>
                  <input
                    className="field-input"
                    value={coupendata.total_uses}
                    onChange={(e) => setCoupenData({ ...coupendata, total_uses: e.target.value })}
                  />
                </div>

                <div>
                  <button className="btn btn-primary" onClick={() => handleAddCoupen()} disabled={loading}>
                    Add
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
                  <th>Coupen Code</th>
                  <th>Discount Amount</th>
                  <th>Discount Percentage</th>
                  <th>Uses</th>
                  <th>Total Used</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {coupens.map((coupen) => (
                  <tr key={coupen.id}>
                    <td data-label="Coupen Code">{coupen.coupen_code}</td>
                    <td data-label="Discount Amount">{coupen.discount_amount}</td>
                    <td data-label="Discount Percentage">{coupen.discount_percentage}</td>
                    <td data-label="Uses">{coupen.total_uses}</td>
                    <td data-label="Total Used">{coupen.used_count}</td>
                    <td data-label="Action" className="cell-actions">
                      <button className="btn btn-danger table-inline-action" onClick={() => setCoupenToDelete(coupen)}>
                        Delete
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
