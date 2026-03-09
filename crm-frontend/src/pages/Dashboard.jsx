import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/api';
import DashboardCharts from '../components/Charts';
import { FiTrendingUp, FiUsers, FiCalendar, FiCheckCircle } from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_leads: 0,
    leads_by_stage: [],
    visits_today: 0,
    closed_deals: 0,
    daily_lead_inflow: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Leads',
      value: stats.total_leads,
      icon: FiUsers,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Visits Today',
      value: stats.visits_today,
      icon: FiCalendar,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Closed Deals (30d)',
      value: stats.closed_deals,
      icon: FiCheckCircle,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Conversion Rate',
      value: stats.total_leads > 0 ? Math.round((stats.closed_deals / stats.total_leads) * 100) : 0,
      icon: FiTrendingUp,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      suffix: '%',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your sales pipeline</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-lg shadow-sm border border-gray-200 p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-3xl font-bold ${stat.textColor} mt-2`}>
                  {stat.value}{stat.suffix || ''}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-full text-white`}>
                <stat.icon className="text-2xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCharts.LeadsByStageChart leadsByStage={stats.leads_by_stage} />
        <DashboardCharts.DailyLeadInflowChart dailyInflow={stats.daily_lead_inflow} />
      </div>
    </div>
  );
};

export default Dashboard;
