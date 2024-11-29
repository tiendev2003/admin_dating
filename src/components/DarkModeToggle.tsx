import { Moon, Sun } from 'lucide-react';
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Button } from './ui/button';

export const DarkModeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useAppContext();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleDarkMode}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
};