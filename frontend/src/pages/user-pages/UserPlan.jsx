import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { BASE_URL } from "../../config"
import Navbar from "../../components/navbar"

export default function UserPlan(){

    const token = localStorage.getItem("token")
    const [userplan , setUserPlan] = useState(null)
    const navigate = useNavigate()
       
    useEffect(() => {
        if (!token){
            navigate("/login")
        }

        const payload = JSON.parse(atob(token.split(".")[1]))
        
        if (payload.role === "admin"){
            navigate("/admin-login")
        }

        fetchUserPlan()

    } , [])

    async function fetchUserPlan(){
        const res = await fetch(`${BASE_URL}/user/get-plan-details`, {
            method : "GET",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${token}`
            }

        })

        const data = await res.json()
        setUserPlan(data)

    }

    function renderPlanDetails(){
        const daysLeft = Math.ceil((new Date(userplan.ending_date) - new Date()) / (1000 * 60 * 60 * 24))
        return <div>
            <div className="user-plan-page">
            
                <div className="user-plan-header">
                    <div>
                        <p className="user-plan-kicker">Membership</p>
                        <h1 className="dashboard-title user-plan-title">Your Active Plan</h1>
                        <p className="dashboard-meta user-plan-intro">A quick summary of your current membership details.</p>
                    </div>

                    <span className={`status-pill ${daysLeft <= 0 ? "status-rejected" : "status-active"}`}>
                        {daysLeft <= 0 ? "Plan Expired" : "Active Plan"}
                    </span>
                </div>

                <div className="user-plan-grid">
                    <div className="user-plan-detail">
                        <span className="user-plan-label">Plan</span>
                        <span className="user-plan-value">{userplan.plan}</span>
                    </div>

                    <div className="user-plan-detail">
                        <span className="user-plan-label">Amount</span>
                        <span className="user-plan-value">{userplan.plan_amount}</span>
                    </div>

                    <div className="user-plan-detail">
                        <span className="user-plan-label">Joining Date</span>
                        <span className="user-plan-value">{userplan.joining_date}</span>
                    </div>

                    <div className="user-plan-detail">
                        <span className="user-plan-label">Days Left</span>
                        <span className="user-plan-value">{daysLeft <= 0 ? "Plan Expired" : daysLeft + " Days Left"}</span>
                    </div>
                    
                    <div>
                        {daysLeft <= 0 && <button onClick={() => navigate("/enroll")}>Renew</button>}
                    </div>

                </div>
                </div>
                </div>
    }

    

    return <div className="site-shell">
            <Navbar/>

            <div className="page-shell">
                <div className="dashboard-card user-plan-panel">
                    {userplan === null &&  <div className="user-plan-loading">
                        <div className="user-plan-spinner" aria-hidden="true"></div>
                        <p className="user-plan-loading-copy">Loading your membership details...</p>
                    </div>}
                        
                    {userplan?.plan === null && <div className="user-plan-page">
                        <p className="user-plan-kicker">Membership</p>
                        <h1 className="dashboard-title user-plan-title">Your Plan</h1>
                        <p className="dashboard-meta user-plan-intro">Keep your current membership details in one place.</p>

                        <div className="empty-state user-plan-empty">
                            <div className="user-plan-empty-content">
                                <p className="empty-copy">No plan enrolled yet</p>
                                <p className="user-plan-empty-copy">Choose a plan to see your amount and membership dates here.</p>
                            </div>
                            <button className="btn btn-primary user-plan-action" onClick={() => navigate("/enroll")}>Enroll Now</button>
                        </div>
                        </div>}

                    {userplan?.plan && renderPlanDetails()}

                    
                </div>
            </div>
        </div>
}
