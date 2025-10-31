import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const links = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/properties', label: 'Manage Properties' },
    { to: '/admin/users', label: 'Manage Users' },
  ];

  return (
    <div className="w-60 h-screen bg-gray-900 text-white flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `block px-3 py-2 rounded-lg mb-2 hover:bg-gray-700 ${
              isActive ? 'bg-gray-700' : ''
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </div>
  );
}
