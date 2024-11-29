import { Book, ChevronDown, ChevronRight, Heart, HelpCircle, Home, Languages, Layout, Users, Wallet } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { cn } from '../../lib/utils';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  subItems?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { icon: <Home className="h-4 w-4" />, label: "Dashboard", href: "/" },
  {
    icon: <Users className="h-4 w-4" />, label: "Interest", href: "#",
    subItems: [
      { label: "Add Interest", href: "/interest/add" },
      { label: "List Interest", href: "/interest/list" },
    ]
  },
  {
    icon: <Languages className="h-4 w-4" />, label: "Language", href: "#",
    subItems: [
      { label: "Add Language", href: "/language/add" },
      { label: "List Language", href: "/language/list" },
    ]
  },
  {
    icon: <Book className="h-4 w-4" />, label: "Religion", href: "#",
    subItems: [
      { label: "Add Religion", href: "/religion/add" },
      { label: "List Religion", href: "/religion/list" },
    ]
  },
  {
    icon: <Heart className="h-4 w-4" />, label: "Relation Goal", href: "#",
    subItems: [
      { label: "Add Relation Goal", href: "/relation-goal/add" },
      { label: "List Relation Goal", href: "/relation-goal/list" },
    ]
  },
  {
    icon: <HelpCircle className="h-4 w-4" />, label: "FAQ", href: "#",
    subItems: [
      { label: "Add FAQ", href: "/faq/add" },
      { label: "List FAQ", href: "/faq/list" },
    ]
  },
  {
    icon: <Layout className="h-4 w-4" />,
    label: "Plan",
    href: "#",
    subItems: [
      { label: "Add Plan", href: "/plan/add" },
      { label: "List Plan", href: "/plan/list" },
    ]
  },

  { icon: <Wallet className="h-4 w-4" />, label: "Payment List", href: "/payments" },
  // list users
  { icon: <Users className="h-4 w-4" />, label: "Users", href: "/users" },
];

const Sidebar: React.FC = () => {
  const { isSidebarOpen, toggleSidebar } = useAppContext();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const location = useLocation();

  const toggleExpand = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 h-screen bg-white dark:bg-gray-800 shadow-sm transition-all duration-300 overflow-y-auto",
      isSidebarOpen ? "w-64" : "w-16"
    )}>
      <div className="flex h-16 items-center justify-between px-4 border-b">
        <div className="flex items-center gap-2">
          <Heart className="h-8 w-8 text-purple-600" fill="currentColor" />
          {isSidebarOpen && <span className="text-xl font-bold">GoMeet</span>}
        </div>
        <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-lg dark:hover:bg-gray-700">
          <Layout className="h-5 w-5" />
        </button>
      </div>

      <nav className="space-y-1 p-2">
        {navItems.map((item, index) => (
          <div key={index}>
            <Link
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700",
                isActive(item.href) && "bg-purple-50 text-purple-600 dark:bg-gray-700"
              )}
              onClick={() => item.subItems && toggleExpand(item.label)}
            >
              {item.icon}
              {isSidebarOpen && (
                <>
                  <span>{item.label}</span>
                  {item.subItems && (
                    expandedItems.includes(item.label)
                      ? <ChevronDown className="ml-auto h-4 w-4" />
                      : <ChevronRight className="ml-auto h-4 w-4" />
                  )}
                </>
              )}
            </Link>
            {isSidebarOpen && item.subItems && expandedItems.includes(item.label) && (
              <div className="ml-6 mt-2 space-y-1">
                {item.subItems.map((subItem) => (
                  <Link
                    key={subItem.label}
                    to={subItem.href}
                    className={cn(
                      "block rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700",
                      isActive(subItem.href) && "bg-purple-50 text-purple-600 dark:bg-gray-700"
                    )}
                  >
                    {subItem.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;