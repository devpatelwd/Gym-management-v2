import { useEffect, useState } from "react"
import AdminNavbar from "../../components/AdminNavbar"
import ConfirmDialog from "../../components/ConfirmDialog"
import { BASE_URL } from "../../config"
import { useNavigate } from "react-router-dom"

export default function AdminMembers() {
  const [members, setMembers] = useState([])
  const token = localStorage.getItem("token")
  const navigate = useNavigate()
  const [showmodal, setShowmodal] = useState(false)
  const [plans, setPlans] = useState([])
  const [showeditmodal, setShoweditmodal] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState(null)
  const [searchfor , setSearchFor] = useState("")
  const [showUnpaidOnly, setShowUnpaidOnly] = useState(false)
  const [showDueOnly, setShowDueOnly] = useState(false)
  const [showEndingSoonOnly, setShowEndingSoonOnly] = useState(false)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tenDaysFromToday = new Date(today)
  tenDaysFromToday.setDate(tenDaysFromToday.getDate() + 10)

  const filtered_member = members.filter((member) => {
    const amountDue = Number(member.plan_amount) - Number(member.amount_paid)
    const endingDate = member.subs_end_date
      ? new Date(
          Number(member.subs_end_date.split("-")[0]),
          Number(member.subs_end_date.split("-")[1]) - 1,
          Number(member.subs_end_date.split("-")[2])
        )
      : null

    return (
      member.name.toLowerCase().includes(searchfor.toLowerCase()) &&
      (!showUnpaidOnly || member.status === "Unpaid") &&
      (!showDueOnly || amountDue > 0) &&
      (!showEndingSoonOnly || (endingDate && endingDate >= today && endingDate <= tenDaysFromToday))
    )
  })

  const [formdata, setFormdata] = useState({
    name: "",
    phone: "",
    gender: "",
    joining_date: new Date().toISOString().split("T")[0],
    subs_end_date: "",
    plan: "",
    status: "",
    plan_amount: 0,
    amount_paid: 0,
    email: ""
  })

  const [selected_member, setSelected_member] = useState({
    name: "",
    phone: "",
    gender: "",
    joining_date: new Date().toISOString().split("T")[0],
    subs_end_date: "",
    plan: "",
    status: "",
    plan_amount: 0,
    amount_paid: 0,
    email: ""
  })

  function fetchMember() {
    fetch(`${BASE_URL}/plans`)
      .then((res) => res.json())
      .then((data) => setPlans(data))

    fetch(`${BASE_URL}/admin/members`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setMembers(data))
  }

  useEffect(() => {
    if (!token) {
      navigate("/admin-login")
    }

    const payload = JSON.parse(atob(token.split(".")[1]))
    if (payload.role === "user") {
      navigate("/login")
    }

    fetchMember()
  }, [])

  async function handleDelete() {
    if (!memberToDelete) {
      return
    }

    await fetch(`${BASE_URL}/admin/delete-member/${memberToDelete.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    setMembers(members.filter((member) => member.id !== memberToDelete.id))
    setMemberToDelete(null)
  }

  async function handleAddMember() {
    await fetch(`${BASE_URL}/admin/add-member`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formdata),
    })

    fetchMember()
    setShowmodal(false)
    setFormdata({
      ...formdata,
      name: "",
      phone: "",
      gender: "",
      joining_date: new Date().toISOString().split("T")[0],
      subs_end_date: "",
      plan: "",
      status: "",
      plan_amount: 0,
      amount_paid: 0,
      email: ""
    })
  }

  async function handleUpdateMember() {
    await fetch(`${BASE_URL}/admin/update-member/${selected_member.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(selected_member),
    })

    fetchMember()
    setShoweditmodal(false)
  }

  function handleEditClick(member) {
    setSelected_member(member)
    setShoweditmodal(true)
  }

  return (
    <div className="site-shell admin-page">
      <AdminNavbar />
      <ConfirmDialog
        open={Boolean(memberToDelete)}
        title="Delete member?"
        message={`This will permanently remove ${memberToDelete?.name ?? "this member"} from the records.`}
        confirmLabel="Delete Member"
        cancelLabel="Keep Member"
        onConfirm={handleDelete}
        onCancel={() => setMemberToDelete(null)}
      />

      <div className="page-shell">
        <div className="toolbar">
          <button className="btn btn-primary" onClick={() => setShowmodal(true)}>
            Add Member
          </button>
        </div>
        <div className="search-panel">
          <label className="field-label search-label" htmlFor="member-search">
            Search Members
          </label>
          <input
            id="member-search"
            className="field-input search-input"
            placeholder="Search by member name"
            value={searchfor}
            onChange={(e) => setSearchFor(e.target.value)}
          ></input>
        </div>

        <div className="search-panel">
          <label className="field-label search-label">Filter Members</label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showUnpaidOnly}
                onChange={(e) => setShowUnpaidOnly(e.target.checked)}
              />
              <span>Fees Unpaid Only</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showDueOnly}
                onChange={(e) => setShowDueOnly(e.target.checked)}
              />
              <span>Due Amount &gt; 0</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showEndingSoonOnly}
                onChange={(e) => setShowEndingSoonOnly(e.target.checked)}
              />
              <span>Ending Within 10 Days</span>
            </label>
          </div>
        </div>

        {showmodal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-form modal-grid">
                <div className="field-group">
                  <label className="field-label">Name</label>
                  <input className="field-input" value={formdata.name} onChange={(e) => setFormdata({ ...formdata, name: e.target.value })} />
                </div>

                <div className="field-group">
                  <label className="field-label">Phone</label>
                  <input className="field-input" value={formdata.phone} onChange={(e) => setFormdata({ ...formdata, phone: e.target.value })} />
                </div>

                <div className="field-group">
                  <label className="field-label">Gender</label>
                  <select className="field-select" value={formdata.status} onChange={(e) => setFormdata({ ...formdata, status: e.target.value })}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="field-group">
                  <label className="field-label">Joining Date</label>
                  <input
                    className="field-input"
                    type="date"
                    value={formdata.joining_date}
                    onChange={(e) => setFormdata({ ...formdata, joining_date: e.target.value })}
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Ending Date</label>
                  <input
                    className="field-input"
                    value={formdata.subs_end_date}
                    onChange={(e) => setFormdata({ ...formdata, subs_end_date: e.target.value })}
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Plan</label>
                  <select
                    className="field-select"
                    value={formdata.plan}
                    onChange={(e) => {
                      const selected_plan = plans.find((p) => p.plan === e.target.value)
                      const endDate = new Date(formdata.joining_date)
                      endDate.setMonth(endDate.getMonth() + selected_plan.months)
                      const subs_end_date = endDate.toISOString().split("T")[0]
                      setFormdata({
                        ...formdata,
                        plan: selected_plan.plan,
                        plan_amount: selected_plan.price,
                        subs_end_date: subs_end_date,
                      })
                    }}
                  >
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.plan}>
                        {plan.plan}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field-group">
                  <label className="field-label">Status</label>
                  <select className="field-select" value={formdata.status} onChange={(e) => setFormdata({ ...formdata, status: e.target.value })}>
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
                </div>

                <div className="field-group">
                  <label className="field-label">Plan Amount</label>
                  <input
                    className="field-input"
                    value={formdata.plan_amount}
                    onChange={(e) => setFormdata({ ...formdata, plan_amount: e.target.value })}
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Amount Paid</label>
                  <input
                    className="field-input"
                    value={formdata.amount_paid}
                    onChange={(e) => setFormdata({ ...formdata, amount_paid: e.target.value })}
                  />
                </div>
                
                <div className="field-group">
                  <label className="field-label">Email</label>
                  <input 
                    className="field-input"
                    value={formdata.email}
                    onChange={(e) => setFormdata({ ...formdata , email: e.target.value})}                  
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    className="btn border border-slate-300 bg-slate-100 text-slate-700 shadow-none"
                    onClick={() => setShowmodal(false)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={() => handleAddMember()}>
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showeditmodal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-form modal-grid">
                <div className="field-group">
                  <label className="field-label">Name</label>
                  <input
                    className="field-input"
                    value={selected_member.name}
                    onChange={(e) => setSelected_member({ ...selected_member, name: e.target.value })}
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Phone</label>
                  <input
                    className="field-input"
                    value={selected_member.phone}
                    onChange={(e) => setSelected_member({ ...selected_member, phone: e.target.value })}
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Gender</label>
                  <select
                    className="field-select"
                    value={selected_member.status}
                    onChange={(e) => setSelected_member({ ...selected_member, status: e.target.value })}
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
                    value={selected_member.joining_date}
                    onChange={(e) => setSelected_member({ ...selected_member, joining_date: e.target.value })}
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Ending Date</label>
                  <input
                    className="field-input"
                    value={selected_member.subs_end_date}
                    onChange={(e) => setSelected_member({ ...selected_member, subs_end_date: e.target.value })}
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Plan</label>
                  <select
                    className="field-select"
                    value={selected_member.plan}
                    onChange={(e) => {
                      const selected_plan = plans.find((p) => p.plan === e.target.value)
                      const endDate = new Date(selected_member.joining_date)
                      endDate.setMonth(endDate.getMonth() + selected_plan.months)
                      const subs_end_date = endDate.toISOString().split("T")[0]
                      setSelected_member({
                        ...selected_member,
                        plan: selected_plan.plan,
                        plan_amount: selected_plan.price,
                        subs_end_date: subs_end_date,
                      })
                    }}
                  >
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.plan}>
                        {plan.plan}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field-group">
                  <label className="field-label">Status</label>
                  <select
                    className="field-select"
                    value={selected_member.status}
                    onChange={(e) => setSelected_member({ ...selected_member, status: e.target.value })}
                  >
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
                </div>

                <div className="field-group">
                  <label className="field-label">Plan Amount</label>
                  <input
                    className="field-input"
                    value={selected_member.plan_amount}
                    onChange={(e) => setSelected_member({ ...selected_member, plan_amount: e.target.value })}
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Amount Paid</label>
                  <input
                    className="field-input"
                    value={selected_member.amount_paid}
                    onChange={(e) => setSelected_member({ ...selected_member, amount_paid: e.target.value })}
                  />
                </div>

                <div className="field-group">
                  <input
                    className="field-input"
                    value={selected_member.email}
                    onChange={(e) => setSelected_member({ ...selected_member, email: e.target.value})}
                  />

                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    className="btn border border-slate-300 bg-slate-100 text-slate-700 shadow-none"
                    onClick={() => setShoweditmodal(false)}
                  >
                    Close
                  </button>
                  <button className="btn btn-secondary" onClick={() => handleUpdateMember()}>
                    Update
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
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Joining Date</th>
                  <th>Ending Date</th>
                  <th>Amount Paid</th>
                  <th>Amount Due</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered_member.map((member) => (
                  <tr key={member.id}>
                    <td data-label="Name">{member.name}</td>
                    <td data-label="Phone">{member.phone}</td>
                    <td data-label="Plan">{member.plan}</td>
                    <td data-label="Status">{member.status}</td>
                    <td data-label="Joining Date">{member.joining_date}</td>
                    <td data-label="Ending Date">{member.subs_end_date}</td>
                    <td data-label="Amount Paid">{member.amount_paid}</td>
                    <td data-label="Amount Due">{member.plan_amount - member.amount_paid}</td>
                    <td data-label="Email">{member.email}</td>
                    <td data-label="Actions" className="cell-actions">
                      <button className="btn btn-danger table-inline-action" onClick={() => setMemberToDelete(member)}>
                        Delete
                      </button>
                      <button className="btn btn-secondary table-inline-action" onClick={() => handleEditClick(member)}>
                        Edit
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
