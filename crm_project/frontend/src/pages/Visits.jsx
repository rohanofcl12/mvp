import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

export default function Visits() {
  const [visits, setVisits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [formData, setFormData] = useState({
    lead: '',
    agent: '',
    visit_date: '',
    visit_time: '',
    location: '',
    status: 'SCHEDULED',
    notes: '',
  });

  useEffect(() => {
    fetchVisits();
    fetchLeads();
    fetchAgents();
  }, []);

  const fetchVisits = () => {
    axios.get(`${API_BASE}/visits/`).then((res) => setVisits(res.data));
  };

  const fetchLeads = () => {
    axios.get(`${API_BASE}/leads/`).then((res) => setLeads(res.data));
  };

  const fetchAgents = () => {
    axios.get(`${API_BASE}/agents/`).then((res) => setAgents(res.data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/visits/`, formData);
      fetchVisits();
      setShowForm(false);
      setFormData({ lead: '', agent: '', visit_date: '', visit_time: '', location: '', status: 'SCHEDULED', notes: '' });
    } catch (error) {
      console.error('Error scheduling visit:', error);
    }
  };

  const handleStatusChange = async (visitId, status) => {
    try {
      await axios.patch(`${API_BASE}/visits/${visitId}/`, { status });
      fetchVisits();
    } catch (error) {
      console.error('Error updating visit:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Visits</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700"
        >
          + Schedule Visit
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
          <h3 className="text-xl font-semibold mb-4">Schedule New Visit</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="lead"
              value={formData.lead}
              onChange={(e) => setFormData({ ...formData, lead: e.target.value })}
              className="border p-2 rounded"
              required
            >
              <option value="">Select Lead</option>
              {leads.map((lead) => (
                <option key={lead.id} value={lead.id}>{lead.name} ({lead.phone})</option>
              ))}
            </select>
            <select
              name="agent"
              value={formData.agent}
              onChange={(e) => setFormData({ ...formData, agent: e.target.value })}
              className="border p-2 rounded"
            >
              <option value="">Select Agent (optional)</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>{agent.name}</option>
              ))}
            </select>
            <input
              name="visit_date"
              type="date"
              value={formData.visit_date}
              onChange={(e) => setFormData({ ...formData, visit_date: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              name="visit_time"
              type="time"
              value={formData.visit_time}
              onChange={(e) => setFormData({ ...formData, visit_time: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="border p-2 rounded"
            />
            <select
              name="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="border p-2 rounded"
            >
              <option value="SCHEDULED">Scheduled</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <div className="col-span-1 md:col-span-2">
              <textarea
                name="notes"
                placeholder="Notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="border p-2 rounded w-full"
                rows="2"
              ></textarea>
            </div>
            <div className="col-span-1 md:col-span-2 flex gap-2">
              <button type="submit" className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700">
                Schedule
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Visits Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Lead</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Agent</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Time</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Location</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((visit) => (
              <tr key={visit.id} className="border-b hover:bg-slate-50">
                <td className="px-6 py-4 font-medium">{visit.lead_name}</td>
                <td className="px-6 py-4">{visit.agent_name || '-'}</td>
                <td className="px-6 py-4">{visit.visit_date}</td>
                <td className="px-6 py-4">{visit.visit_time}</td>
                <td className="px-6 py-4">{visit.location || '-'}</td>
                <td className="px-6 py-4">
                  <select
                    value={visit.status}
                    onChange={(e) => handleStatusChange(visit.id, e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{visit.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="mt-8 text-center text-xs text-gray-400">
        CRM MVP Prototype Designed and conceptualized by Swarnav
      </footer>
    </div>
  );
}