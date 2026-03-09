import { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

const API_BASE = 'http://localhost:8000/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE}/dashboard/stats/`).then((res) => {
      setStats(res.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!stats || loading) return;

    // Stage Chart (Doughnut)
    const stageCtx = document.getElementById('stageChart');
    if (stageCtx) {
      new Chart(stageCtx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(stats.leads_by_stage),
          datasets: [{
            data: Object.values(stats.leads_by_stage),
            backgroundColor: ['#9CA3AF', '#3B82F6', '#F59E0B', '#6366F1', '#10B981', '#EF4444'],
          }],
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
      });
    }

    // Inflow Chart (Line)
    const inflowCtx = document.getElementById('inflowChart');
    if (inflowCtx) {
      new Chart(inflowCtx, {
        type: 'line',
        data: {
          labels: Object.keys(stats.daily_inflow || {}),
          datasets: [{
            label: 'Leads',
            data: Object.values(stats.daily_inflow || {}),
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.3,
          }],
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
      });
    }
  }, [stats, loading]);

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Dashboard</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="text-gray-500 text-sm">Total Leads</div>
          <div className="text-3xl font-bold text-slate-800">{stats.total_leads}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="text-gray-500 text-sm">Visits Today</div>
          <div className="text-3xl font-bold text-slate-800">{stats.visits_today}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="text-gray-500 text-sm">Closed Deals</div>
          <div className="text-3xl font-bold text-green-600">{stats.closed_deals}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="text-gray-500 text-sm">Lost Deals</div>
          <div className="text-3xl font-bold text-red-600">{stats.lost_deals}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Leads by Stage</h3>
          <canvas id="stageChart" height="200"></canvas>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Daily Lead Inflow</h3>
          <canvas id="inflowChart" height="200"></canvas>
        </div>
      </div>

      <footer className="mt-12 text-center text-xs text-gray-400">
        CRM MVP Prototype Designed and conceptualized by Swarnav
      </footer>
    </div>
  );
}