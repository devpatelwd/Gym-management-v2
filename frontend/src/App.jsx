import Landing from "./pages/Landing"
import Register from "./pages/user-pages/register"
import Login from "./pages/Login"
import Dashboard from "./pages/user-pages/Dashboard"
import Enroll from "./pages/user-pages/enroll"
import AdminLogin from "./pages/admin-pages/AdminLogin"
import AdminDashboard from "./pages/admin-pages/AdminDashboard"
import AdminCoupen from "./pages/admin-pages/AdminCoupen"
import AdminMembers from "./pages/admin-pages/AdminMembers"
import AdminRequests from "./pages/admin-pages/AdminRequest"
import AdminPlans from "./pages/admin-pages/AdminPlans"
import UserPlan from "./pages/user-pages/UserPlan"
import AdminCharts from "./pages/admin-pages/AdminCharts"

import { BrowserRouter , Routes , Route } from "react-router-dom"

export default function App(){
  return <BrowserRouter><Routes><Route path="/" element={<Landing/>} /> 
                                <Route path="/login" element={<Login/>}/>
                                <Route path="/register" element={<Register/>}/>
                                <Route path="/dashboard" element={<Dashboard/>}/>
                                <Route path="/enroll" element={<Enroll/>}/>
                                <Route path="/user-plan" element={<UserPlan/>}/>
                                <Route path="/admin-login" element={<AdminLogin/>}/>
                                <Route path="/admin-dashboard" element={<AdminDashboard/>}/>
                                <Route path="/admin-coupens" element={<AdminCoupen/>}/>
                                <Route path="/admin-members" element={<AdminMembers/>}/>
                                <Route path="/admin-request" element={<AdminRequests/>}/>
                                <Route path="/admin-plans" element={<AdminPlans/>}/>
                                <Route path="/admin-charts" element={<AdminCharts/>}/>
                                </Routes></BrowserRouter>

}