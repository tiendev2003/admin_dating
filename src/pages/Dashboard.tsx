import React from 'react';
import Header from '../components/Dashboard/Header';
import StatCard from '../components/Dashboard/StatCard';
import { useAppContext } from '../contexts/AppContext';
import { cn } from '../lib/utils';

const stats = [
  { label: "Interest", value: "9", icon: "❤️" },
  { label: "Language", value: "13", icon: "💬" },
  { label: "Religion", value: "12", icon: "🙏" },
  { label: "Relation Goal", value: "7", icon: "💝" },
  { label: "FAQ", value: "10", icon: "❓" },
  { label: "Plan", value: "3", icon: "📋" },
  { label: "Total Users", value: "812", icon: "👥" },
  { label: "Total Pages", value: "4", icon: "📄" },
  { label: "Total Gift", value: "10", icon: "🎁" },
  { label: "Total Package", value: "3", icon: "📦" },
  { label: "Total Male", value: "698", icon: "👨" },
  { label: "Total Female", value: "105", icon: "👩" },
];

const Dashboard: React.FC = () => {
  const { isSidebarOpen } = useAppContext();

  return (
    <div className={cn(
      "transition-all duration-300",
      isSidebarOpen ? "pl-64" : "pl-16"
    )}>
      <Header />
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;