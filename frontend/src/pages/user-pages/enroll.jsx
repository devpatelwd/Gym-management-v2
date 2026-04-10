import { useEffect, useState } from "react"
import Navbar from "../../components/navbar"
import { useNavigate } from "react-router-dom"
import { BASE_URL } from "../../config"
import useActionLock from "../../hooks/useActionLock"

export default function Enroll() {
  const [plans, setPlans] = useState([])
  const [selected_plan, setSelected_plan] = useState("")
  const [coupen, setCoupen] = useState("")
  const token = localStorage.getItem("token")
  const navigate = useNavigate()
  const [discountprice, setDiscountprice] = useState(null)
  const [error , setError] = useState("")
  const { isLocked, runLocked } = useActionLock()

  useEffect(() => {
    fetch(`${BASE_URL}/plans/`)
      .then((res) => res.json())
      .then((data) => setPlans(data))
  }, [])

  async function handleEnroll() {
    const res = await fetch(`${BASE_URL}/user/enroll-plan/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ plan_id: selected_plan, coupen_code: coupen }),
    })
    

    const data = await res.json()
    if (data.detail === "Already Requested"){
      setError("You Already have a pending request ")
      return 
    }

    if (data.detail === "Already an active member"){
      setError("You are Already an Active Member")
      return 
    }

    navigate("/dashboard")
  
  }

  async function handleApplycoupen() {
    const res = await fetch(`${BASE_URL}/user/apply-coupen`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ coupen, selected_plan }),
    })

    const data = await res.json()
    setDiscountprice(data.discounted_price)
  }

  return (
    <div className="site-shell">
      <Navbar />

      {error && (
        <div role="alertdialog" aria-modal="true" className="modal-overlay">
          <div className="modal-card confirm-dialog enroll-error-dialog">
            <h3 className="confirm-title enroll-error-title">Enrollment Error</h3>
            <p className="confirm-message enroll-error-message">{error}</p>
            <div className="confirm-actions enroll-error-actions">
              <button className="btn btn-primary" onClick={() => setError("")}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="page-shell">
        <div className="plan-grid interactive-plan-grid">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelected_plan(plan.id)}
              className={`plan-card selectable-card ${selected_plan === plan.id ? "is-selected" : ""}`}
            >
              <h3 className="plan-name">{plan.plan}</h3>
              <p className="plan-price">₹ {plan.price}</p>
            </div>
          ))}
        </div>

        <div className="action-panel enroll-actions">
          <input
            className="field-input"
            placeholder="Enter Coupen Code"
            value={coupen}
            onChange={(e) => setCoupen(e.target.value)}
          />
          <button
            className="btn btn-secondary"
            onClick={() => runLocked("applyCoupen", handleApplycoupen)}
            disabled={isLocked("applyCoupen")}
          >
            Apply Coupon
          </button>
          <button
            className="btn btn-primary"
            onClick={() => runLocked("enrollPlan", handleEnroll)}
            disabled={isLocked("enrollPlan")}
          >
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  )
}
