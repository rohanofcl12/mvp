import React from 'react';

const LeadCard = ({ lead, onDragStart, onDrop, onDragOver, onClick, showActions = true }) => {
  const stageColors = {
    NEW: 'bg-gray-500',
    CONTACTED: 'bg-blue-500',
    VISIT_SCHEDULED: 'bg-yellow-500',
    VISIT_DONE: 'bg-green-500',
    CLOSED: 'bg-purple-500',
    LOST: 'bg-red-500',
  };

  const getStageLabel = (stage) => {
    const labels = {
      NEW: 'New',
      CONTACTED: 'Contacted',
      VISIT_SCHEDULED: 'Visit Scheduled',
      VISIT_DONE: 'Visit Done',
      CLOSED: 'Closed',
      LOST: 'Lost',
    };
    return labels[stage] || stage;
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, lead)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, lead)}
      onClick={() => onClick && onClick(lead)}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-move hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-800 text-lg truncate">{lead.name}</h3>
        <span className={`text-xs text-white px-2 py-1 rounded-full ${stageColors[lead.stage] || 'bg-gray-500'}`}>
          {getStageLabel(lead.stage)}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <p><span className="font-medium">Phone:</span> {lead.phone || 'N/A'}</p>
        <p><span className="font-medium">Email:</span> {lead.email || 'N/A'}</p>
        <p><span className="font-medium">Source:</span> {lead.source}</p>
        {lead.assigned_agent && (
          <p><span className="font-medium">Agent:</span> {lead.assigned_agent.name}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
            Score: {lead.intelligence_score || 3}
          </span>
        </div>
      </div>

      {showActions && (
        <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onClick && onClick(lead); }}
            className="flex-1 text-xs bg-blue-50 text-blue-600 px-2 py-1.5 rounded hover:bg-blue-100 transition-colors"
          >
            View
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); /* Schedule visit */ }}
            className="flex-1 text-xs bg-green-50 text-green-600 px-2 py-1.5 rounded hover:bg-green-100 transition-colors"
          >
            Schedule
          </button>
        </div>
      )}
    </div>
  );
};

export default LeadCard;
