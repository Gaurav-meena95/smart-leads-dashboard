import React from 'react';

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 h-[calc(100vh-4rem)] flex-shrink-0">
      <div className="py-4 px-3">
        <ul className="space-y-2">
          <li>
            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="ml-3 font-medium">Dashboard</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="ml-3 font-medium">Leads</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="ml-3 font-medium">Settings</span>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
};
