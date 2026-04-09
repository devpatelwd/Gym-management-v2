import { useEffect, useState } from "react"
import { BASE_URL } from "../../config"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts"
import AdminNavbar from "../../components/AdminNavbar"

export default function AdminCharts() {
  const token = localStorage.getItem("token")
  const [start_date, setStartDate] = useState("")
  const [end_date, setEndDate] = useState("")
  const [chartdata, setChartData] = useState(null)

  useEffect(() => {
    const ending_date = new Date()

    const starting_date = new Date(ending_date.getFullYear(), ending_date.getMonth(), 1)

    const year = starting_date.getFullYear()
    const month = String(starting_date.getMonth() + 1).padStart(2, "0")
    const day = String(starting_date.getDate()).padStart(2, "0")  
    const starting_date_str = `${year}-${month}-${day}`
    
    
    const e_year = ending_date.getFullYear()
    const e_month = String(ending_date.getMonth() + 1).padStart(2, "0")
    const e_day = String(ending_date.getDate()).padStart(2, "0")
    const ending_date_str = `${e_year}-${e_month}-${e_day}`

    setStartDate(starting_date_str)
    setEndDate(ending_date_str)

    handleChartApi(starting_date_str, ending_date_str)
  }, [])

  async function handleChartApi(starting_date_str, ending_date_str) {
    const res = await fetch(
      `${BASE_URL}/admin/get-chart-stats?joiningdate=${starting_date_str}&endingdate=${ending_date_str}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await res.json()
    const data_array = Object.entries(data).map(([month, values]) => ({ month, ...values }))
    setChartData(data_array)
  }

  if (!chartdata) {
    return (
      <div className="site-shell admin-page">
        <AdminNavbar />

        <div className="page-shell">
          <div className="admin-charts-page">
            <section className="admin-charts-hero">
              <div className="admin-charts-hero-content">
                <div>
                  <p className="admin-charts-kicker">Performance Overview</p>
                  <h1 className="admin-charts-title">Charts</h1>
                </div>
              </div>
            </section>

            <div className="stat-card admin-charts-loading-card">
              <div className="admin-charts-loading-copy">
                <h2 className="stat-label">Loading Charts</h2>
                <p>Pulling the latest data for the selected date range.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="site-shell admin-page">
      <AdminNavbar />
      <div className="page-shell">
        <div className="admin-charts-page">
          <section className="admin-charts-hero">
            <div className="admin-charts-hero-content">
              <div>
                <p className="admin-charts-kicker">Performance Overview</p>
                <h1 className="admin-charts-title">Charts</h1>
              </div>

              <div className="admin-charts-range">
                <p className="admin-charts-range-label">Current range</p>
                <p className="admin-charts-range-value">
                  {start_date} to {end_date}
                </p>
              </div>
            </div>

            <div className="admin-charts-toolbar">
              <div className="admin-charts-field">
                <label>Start date</label>
                <input
                  className="admin-charts-input"
                  value={start_date}
                  type="date"
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="admin-charts-field">
                <label>EndDate</label>
                <input
                  className="admin-charts-input"
                  value={end_date}
                  type="date"
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <button
                className="admin-charts-button"
                onClick={() => handleChartApi(start_date, end_date)}
              >
                Apply
              </button>
            </div>

            <div className="admin-charts-summary">
              <div className="admin-charts-summary-card">
                <p className="admin-charts-summary-label">Members</p>
                <p className="admin-charts-summary-value">Monthly registration trend</p>
              </div>

              <div className="admin-charts-summary-card">
                <p className="admin-charts-summary-label">Revenue</p>
                <p className="admin-charts-summary-value">Clean view of incoming cashflow</p>
              </div>

              <div className="admin-charts-summary-card">
                <p className="admin-charts-summary-label">Due</p>
                <p className="admin-charts-summary-value">Outstanding balance movement</p>
              </div>
            </div>
          </section>

          <div className="admin-charts-grid">
            <div className="stat-card admin-chart-card">
              <div className="admin-chart-card-head">
                <div>
                  <span className="admin-chart-badge is-members">Growth</span>
                  <h2 className="admin-chart-title">Monthly Members</h2>
                  <p className="admin-chart-text">
                    A cleaner bar view for spotting strong signup months at a glance.
                  </p>
                </div>

                <div className="admin-chart-icon is-members"></div>
              </div>

              <div className="admin-chart-frame">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartdata} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
                    <defs>
                      <linearGradient id="membersBarFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ff8a5c" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      stroke="rgba(148, 163, 184, 0.22)"
                      strokeDasharray="4 6"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tickMargin={12}
                    />
                    <YAxis axisLine={false} tickLine={false} tickMargin={10} />
                    <Tooltip
                      wrapperClassName="admin-chart-tooltip"
                      cursor={{ fill: "rgba(255, 107, 53, 0.08)" }}
                    />
                    <Bar
                      dataKey="members"
                      fill="url(#membersBarFill)"
                      radius={[14, 14, 5, 5]}
                      maxBarSize={42}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="stat-card admin-chart-card">
              <div className="admin-chart-card-head">
                <div>
                  <span className="admin-chart-badge is-revenue">Cashflow</span>
                  <h2 className="admin-chart-title">Revenue Trend</h2>
                  <p className="admin-chart-text">
                    A smoother line and stronger contrast for revenue movement over time.
                  </p>
                </div>

                <div className="admin-chart-icon is-revenue"></div>
              </div>

              <div className="admin-chart-frame">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartdata} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
                    <CartesianGrid
                      stroke="rgba(148, 163, 184, 0.22)"
                      strokeDasharray="4 6"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tickMargin={12}
                    />
                    <YAxis axisLine={false} tickLine={false} tickMargin={10} />
                    <Tooltip
                      wrapperClassName="admin-chart-tooltip"
                      cursor={{ stroke: "rgba(20, 184, 166, 0.22)", strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#14b8a6"
                      strokeWidth={3.5}
                      dot={{ r: 4, fill: "#14b8a6", stroke: "#ffffff", strokeWidth: 2 }}
                      activeDot={{ r: 7, fill: "#14b8a6", stroke: "#ffffff", strokeWidth: 2 }}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="stat-card admin-chart-card is-wide">
              <div className="admin-chart-card-head">
                <div>
                  <span className="admin-chart-badge is-due">Outstanding</span>
                  <h2 className="admin-chart-title">Due Trend</h2>
                  <p className="admin-chart-text">
                    Wider layout so outstanding balances are easier to compare month by month.
                  </p>
                </div>

                <div className="admin-chart-icon is-due"></div>
              </div>

              <div className="admin-chart-frame is-wide">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartdata} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
                    <CartesianGrid
                      stroke="rgba(148, 163, 184, 0.22)"
                      strokeDasharray="4 6"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tickMargin={12}
                    />
                    <YAxis axisLine={false} tickLine={false} tickMargin={10} />
                    <Tooltip
                      wrapperClassName="admin-chart-tooltip"
                      cursor={{ stroke: "rgba(245, 158, 11, 0.25)", strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="due"
                      stroke="#d97706"
                      strokeWidth={3.5}
                      dot={{ r: 4, fill: "#d97706", stroke: "#ffffff", strokeWidth: 2 }}
                      activeDot={{ r: 7, fill: "#d97706", stroke: "#ffffff", strokeWidth: 2 }}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
