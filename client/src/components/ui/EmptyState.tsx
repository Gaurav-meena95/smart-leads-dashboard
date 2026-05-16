import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-center w-12 h-12 mb-4 bg-blue-100 rounded-full">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
    </div>
  );
};

export default EmptyState;
