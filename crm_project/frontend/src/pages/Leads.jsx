import { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import LeadDetailModal from '../components/LeadDetailModal';

const API_BASE = 'http://localhost:8000/api';

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    source: 'OTHER',
    stage: 'NEW',
    assigned_agent_id: '',
  });

  useEffect(() => {
    fetchLeads();
    fetchAgents();
  }, []);

  const fetchLeads = () => {
    axios.get(`${API_BASE}/leads/`).then((res) => setLeads(res.data));
  };

  const fetchAgents = () => {
    axios.get(`${API_BASE}/agents/`).then((res) => setAgents(res.data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLead) {
        await axios.put(`${API_BASE}/leads/${editingLead.id}/`, formData);
      } else {
        await axios.post(`${API_BASE}/leads/`, formData);
      }
      fetchLeads();
      resetForm();
    } catch (error) {
      console.error('Error saving lead:', error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingLead(null);
    setFormData({ name: '', phone: '', email: '', source: 'OTHER', stage: 'NEW', assigned_agent_id: '' });
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setFormData({
      name: lead.name,
      phone: lead.phone,
      email: lead.email || '',
      source: lead.source,
      stage: lead.stage,
      assigned_agent_id: lead.assigned_agent?.id || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this lead?')) {
      await axios.delete(`${API_BASE}/leads/${id}/`);
      fetchLeads();
    }
  };

  const getStageColor = (stage) => {
    const colors = {
      NEW: 'bg-gray-100 text-gray-800',
      CONTACTED: 'bg-blue-100 text-blue-800',
      VISIT_SCHEDULED: 'bg-yellow-100 text-yellow-800',
      VISIT_DONE: 'bg-indigo-100 text-indigo-800',
      CLOSED: 'bg-green-100 text-green-800',
      LOST: 'bg-red-100 text-red-800',
    };
    return colors[stage] || 'bg-gray-100';
  };

  const handleAssign = async (leadId, agentId) => {
    try {
      await axios.post(`${API_BASE}/leads/${leadId}/assign/`, { agent_id: agentId });
      fetchLeads();
    } catch (error) {
      console.error('Error assigning agent:', error);
    }
  };

  const handleStageChange = async (leadId, stage) => {
    try {
      await axios.post(`${API_BASE}/leads/${leadId}/stage/`, { stage });
      fetchLeads();
    } catch (error) {
      console.error('Error updating stage:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Leads</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700"
        >
          + Add Lead
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
          <h3 className="text-xl font-semibold mb-4">{editingLead ? 'Edit Lead' : 'New Lead'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              name="email"
              placeholder="Email (optional)"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border p-2 rounded"
            />
            <select
              name="source"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="border p-2 rounded"
            >
              <option value="REFERRAL">Referral</option>
              <option value="WEBSITE">Website</option>
              <option value="FACEBOOK">Facebook</option>
              <option value="INSTAGRAM">Instagram</option>
              <option value="OTHER">Other</option>
            </select>
            <select
              name="stage"
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
              className="border p-2 rounded"
            >
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="VISIT_SCHEDULED">Visit Scheduled</option>
              <option value="VISIT_DONE">Visit Done</option>
              <option value="CLOSED">Closed</option>
              <option value="LOST">Lost</option>
            </select>
            <select
              name="assigned_agent_id"
              value={formData.assigned_agent_id}
              onChange={(e) => setFormData({ ...formData, assigned_agent_id: e.target.value })}
              className="border p-2 rounded"
            >
              <option value="">Unassigned</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>{agent.name}</option>
              ))}
            </select>
            <div className="col-span-1 md:col-span-2 flex gap-2">
              <button type="submit" className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700">
                {editingLead ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={resetForm} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Leads Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Source</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Agent</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Stage</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Score</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b hover:bg-slate-50">
                <td className="px-6 py-4">
                  <button onClick={() => setSelectedLead(lead)} className="font-medium text-blue-600 hover:underline">
                    {lead.name}
                  </button>
                </td>
                <td className="px-6 py-4">{lead.phone}</td>
                <td className="px-6 py-4">{lead.source}</td>
                <td className="px-6 py-4">{lead.assigned_agent?.name || '-'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(lead.stage)}`}>
                    {lead.stage}
                  </span>
                </td>
                <td className="px-6 py-4 text-center font-bold text-slate-700">{lead.score}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(lead)} className="text-blue-600 hover:underline text-sm">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(lead.id)} className="text-red-600 hover:underline text-sm">
                      Delete
                    </button>
                    <select
                      onChange={(e) => e.target.value && handleStageChange(lead.id, e.target.value)}
                      className="text-sm border rounded px-2 py-1"
                      defaultValue=""
                    >
                      <option value="" disabled>Stage</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="VISIT_SCHEDULED">Visit Scheduled</option>
                      <option value="VISIT_DONE">Visit Done</option>
                      <option value="CLOSED">Closed</option>
                      <option value="LOST">Lost</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedLead && (
        <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
      )}

      <footer className="mt-8 text-center text-xs text-gray-400">
        CRM MVP Prototype Designed and conceptualized by Swarnav
      </footer>
    </div>
  );
}