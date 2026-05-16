import React from 'react';
import { useAuth } from '../../hooks/useAuth';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 flex justify-between items-center h-16">
      <div className="flex items-center">
        <span className="text-xl font-bold text-primary">Smart Leads</span>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-gray-600 font-medium">Welcome, {user.name}</span>
            <button 
              onClick={logout}
              className="text-sm font-medium text-danger hover:text-red-700 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <span className="text-sm text-gray-600">Not logged in</span>
        )}
      </div>
    </nav>
  );
};
