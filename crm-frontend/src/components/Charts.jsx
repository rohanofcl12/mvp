import React from 'react';
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const LeadsByStageChart = ({ leadsByStage }) => {
  const stageLabels = leadsByStage.map(item => {
    const labels = {
      NEW: 'New',
      CONTACTED: 'Contacted',
      VISIT_SCHEDULED: 'Visit Scheduled',
      VISIT_DONE: 'Visit Done',
      CLOSED: 'Closed',
      LOST: 'Lost',
    };
    return labels[item.stage] || item.stage;
  });
  const stageCounts = leadsByStage.map(item => item.count);
  const colors = [
    'rgba(156, 163, 175, 0.8)',   // gray
    'rgba(59, 130, 246, 0.8)',    // blue
    'rgba(245, 158, 11, 0.8)',    // yellow
    'rgba(34, 197, 94, 0.8)',     // green
    'rgba(168, 85, 247, 0.8)',    // purple
    'rgba(239, 68, 68, 0.8)',     // red
  ];

  const data = {
    labels: stageLabels,
    datasets: [
      {
        data: stageCounts,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Leads by Stage',
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div style={{ height: '300px' }}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

const DailyLeadInflowChart = ({ dailyInflow }) => {
  const data = {
    labels: dailyInflow.map(item => item.date),
    datasets: [
      {
        label: 'Leads',
        data: dailyInflow.map(item => item.count),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Daily Lead Inflow (Last 7 Days)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div style={{ height: '300px' }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

const DashboardCharts = { LeadsByStageChart, DailyLeadInflowChart };

export default DashboardCharts;
