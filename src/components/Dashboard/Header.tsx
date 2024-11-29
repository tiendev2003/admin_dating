import { Bell, Maximize } from 'lucide-react';
import React from 'react';
import { DarkModeToggle } from '../DarkModeToggle';
import { Button } from '../ui/button';
 

const Header: React.FC = () => {
  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-4">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <div className="flex items-center gap-4">
        <DarkModeToggle />
        <Button variant="ghost" size="icon">
          <Maximize className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>
    </header>
  );
};

export default Header;