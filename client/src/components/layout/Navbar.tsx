import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Target } from 'lucide-react';
import Button from '../ui/Button';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900 flex items-center">
              Smart Leads <span className="h-2 w-2 rounded-full bg-blue-600 ml-1"></span>
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full uppercase tracking-wider">
                    {user.role}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-gray-500 hover:text-red-600"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
