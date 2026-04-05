import Navbar from "../components/navbar"
import { useState, useEffect } from "react"
import { BASE_URL } from "../config"
import { useNavigate } from "react-router-dom"

export default function Landing() {
  const [plans, setPlans] = useState([])
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  useEffect(() => {
    fetch(`${BASE_URL}/plans/`)
      .then((res) => res.json())
      .then((data) => setPlans(data))
  }, [])

  function handleGetStarted() {
    if (!token) {
      navigate("/login")
    }

    const payload = JSON.parse(atob(token.split(".")[1]))

    if (payload.role === "user") {
      navigate("/dashboard")
    }

    if (payload.role === "admin") {
      navigate("/admin-dashboard")
    }
  }

  return (
    <div className="site-shell landing-page">
      <Navbar />

      <section className="hero-section">
        <div className="hero-card">
          <h1 className="hero-title">Transform Yourself</h1>
          <p className="hero-copy">Join Kailash Gym and Fitness Today</p>
          <button className="btn btn-primary hero-cta" onClick={() => handleGetStarted()}>
            Get Started
          </button>
        </div>
      </section>

      <section className="section-shell plans-showcase">
        <h2 className="section-title">Our Plans</h2>
        <div className="plan-grid">
          {plans.map((plan) => (
            <div key={plan.id} className="plan-card">
              <h3 className="plan-name">{plan.plan}</h3>
              <p className="plan-price">₹ {plan.price}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
