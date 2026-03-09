import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function LeadDetailModal({ lead, onClose }) {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetch(`http://localhost:8000/api/leads/${lead.id}/timeline/`)
      .then((res) => res.json())
      .then((data) => {
        setTimeline(data);
        setLoading(false);
      });
  }, [lead]);

  if (!lead) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{lead.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <div className="text-sm text-gray-500">Phone</div>
            <div>{lead.phone}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Email</div>
            <div>{lead.email || '-'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Source</div>
            <div>{lead.source}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Score</div>
            <div className="font-bold text-slate-700">{lead.score}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Stage</div>
            <div>{lead.stage}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Agent</div>
            <div>{lead.assigned_agent?.name || 'Unassigned'}</div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Notes</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{lead.notes || 'No notes'}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Activity Timeline</h3>
          {loading ? (
            <p>Loading timeline...</p>
          ) : timeline.length === 0 ? (
            <p className="text-gray-500">No activity recorded yet.</p>
          ) : (
            <ul className="space-y-3">
              {timeline.map((activity) => (
                <li key={activity.id} className="border-l-2 border-slate-300 pl-4">
                  <div className="font-medium text-slate-800">{activity.action}</div>
                  <div className="text-sm text-gray-500">{formatDate(activity.timestamp)}</div>
                  {activity.notes && <div className="text-sm text-gray-600 mt-1">{activity.notes}</div>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}