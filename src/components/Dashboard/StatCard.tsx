import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-purple-600 font-medium">{label}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;