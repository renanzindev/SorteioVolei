import React from 'react';
import { Shuffle, Menu, X } from 'lucide-react';

interface HeaderProps {
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMobileMenuOpen }) => {
  return (
    <header className="w-full bg-gradient-to-r from-blue-600 to-blue-500 dark:from-gray-800 dark:to-gray-700 p-4 md:p-6 shadow-md">
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-md text-white hover:bg-blue-700 dark:hover:bg-gray-600 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
        
        {/* Logo and Title */}
        <div className="flex items-center justify-center flex-1 lg:justify-start lg:flex-none">
          <Shuffle className="h-8 w-8 text-white mr-3" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Sorteador de Times</h1>
        </div>
        
        {/* Spacer for mobile to center the title */}
        <div className="lg:hidden w-10"></div>
      </div>
    </header>
  );
};

export default Header;