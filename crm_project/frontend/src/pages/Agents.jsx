import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: 'Agent' });

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = () => {
    axios.get(`${API_BASE}/agents/`).then((res) => setAgents(res.data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/agents/`, formData);
      fetchAgents();
      setShowForm(false);
      setFormData({ name: '', email: '', phone: '', role: 'Agent' });
    } catch (error) {
      console.error('Error creating agent:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Agents</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700"
        >
          + Add Agent
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
          <h3 className="text-xl font-semibold mb-4">New Agent</h3>
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
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border p-2 rounded"
              required
            />
            <input
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="border p-2 rounded"
            />
            <select
              name="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="border p-2 rounded"
            >
              <option value="Agent">Agent</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
            <div className="col-span-1 md:col-span-2 flex gap-2">
              <button type="submit" className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700">
                Create
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-xl font-bold mb-4">
              {agent.name.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-lg font-semibold">{agent.name}</h3>
            <p className="text-sm text-gray-600">{agent.role}</p>
            <div className="mt-3 text-sm text-gray-500">
              <div>{agent.email}</div>
              <div>{agent.phone}</div>
            </div>
          </div>
        ))}
      </div>

      <footer className="mt-8 text-center text-xs text-gray-400">
        CRM MVP Prototype Designed and conceptualized by Swarnav
      </footer>
    </div>
  );
}