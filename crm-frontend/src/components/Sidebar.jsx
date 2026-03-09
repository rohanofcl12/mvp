import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiUsers, FiGrid, FiCalendar, FiBarChart2 } from 'react-icons/fi';

const Sidebar = () => {
  const navItems = [
    { to: '/', icon: FiHome, label: 'Dashboard' },
    { to: '/leads', icon: FiUsers, label: 'Leads' },
    { to: '/pipeline', icon: FiGrid, label: 'Pipeline' },
    { to: '/visits', icon: FiCalendar, label: 'Visits' },
    { to: '/agents', icon: FiBarChart2, label: 'Agents' },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white flex flex-col shadow-xl">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-blue-400">CRM MVP</h1>
        <p className="text-xs text-gray-400 mt-1">Lead Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <item.icon className="text-xl" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <p className="text-xs text-gray-500 text-center">
          CRM MVP Prototype<br />
          Designed and conceptualized by Swarnav
        </p>
        <p className="text-[10px] text-gray-600 text-center mt-1">
          © 2025 Lead Management System
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
