import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

const API_BASE = 'http://localhost:8000/api';

export default function Pipeline() {
  const [leads, setLeads] = useState([]);
  const [draggedLead, setDraggedLead] = useState(null);

  const stages = [
    { key: 'NEW', label: 'New' },
    { key: 'CONTACTED', label: 'Contacted' },
    { key: 'VISIT_SCHEDULED', label: 'Visit Scheduled' },
    { key: 'VISIT_DONE', label: 'Visit Done' },
    { key: 'CLOSED', label: 'Closed' },
    { key: 'LOST', label: 'Lost' },
  ];

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = () => {
    axios.get(`${API_BASE}/leads/`).then((res) => setLeads(res.data));
  };

  const handleDragStart = (lead) => {
    setDraggedLead(lead);
  };

  const handleDrop = async (stage) => {
    if (!draggedLead) return;
    try {
      await axios.post(`${API_BASE}/leads/${draggedLead.id}/stage/`, { stage });
      fetchLeads();
      setDraggedLead(null);
    } catch (error) {
      console.error('Error moving lead:', error);
    }
  };

  const getStageColor = (stage) => {
    const colors = {
      NEW: 'bg-gray-100 border-gray-300',
      CONTACTED: 'bg-blue-50 border-blue-200',
      VISIT_SCHEDULED: 'bg-yellow-50 border-yellow-200',
      VISIT_DONE: 'bg-indigo-50 border-indigo-200',
      CLOSED: 'bg-green-50 border-green-200',
      LOST: 'bg-red-50 border-red-200',
    };
    return colors[stage] || 'bg-gray-100';
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Pipeline Board</h2>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {stages.map((stage) => (
          <div
            key={stage.key}
            className={`rounded-xl p-4 min-h-[400px] border-2 ${getStageColor(stage.key)}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(stage.key)}
          >
            <h3 className="font-semibold text-gray-700 mb-4">{stage.label}</h3>
            <div className="space-y-3">
              {leads
                .filter((lead) => lead.stage === stage.key)
                .map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={() => handleDragStart(lead)}
                    className="bg-white p-4 rounded-lg shadow-sm border cursor-move hover:shadow"
                  >
                    <div className="font-medium text-slate-800">{lead.name}</div>
                    <div className="text-sm text-gray-600">{lead.phone}</div>
                    <div className="text-xs text-gray-400 mt-2">Score: {lead.score}</div>
                    {lead.assigned_agent && (
                      <div className="text-xs text-blue-600 mt-1">{lead.assigned_agent.name}</div>
                    )}
                  </div>
                ))}
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