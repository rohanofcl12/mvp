import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/leads', label: 'Leads', icon: '👥' },
  { path: '/pipeline', label: 'Pipeline', icon: '🚀' },
  { path: '/visits', label: 'Visits', icon: '📅' },
  { path: '/agents', label: 'Agents', icon: '👔' },
];

export default function Sidebar({ activePage, setActivePage }) {
  const location = useLocation();

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold">CRM MVP</h1>
        <p className="text-xs text-gray-400">Lead Management</p>
      </div>
      <nav className="flex-1 space-y-2 px-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setActivePage(item.label.toLowerCase())}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              location.pathname === item.path
                ? 'bg-slate-800 text-white'
                : 'text-gray-300 hover:bg-slate-800'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-700 text-xs text-gray-400 text-center">
        © 2025 Swarnav
      </div>
    </div>
  );
}