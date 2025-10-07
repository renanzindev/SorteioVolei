import React from 'react';
import logo from '../assets/bola-de-voleibol.png';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-gradient-to-r from-blue-600 to-blue-500 dark:from-gray-800 dark:to-gray-700 p-4 md:p-6 shadow-md">
      <div className="flex items-center justify-center">
        {/* Logo and Title */}
        <div className="flex items-center">
          <img 
            src={logo}
            alt="Voleibol"
            className="h-8 w-8 mr-3"
          />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Sorteio Volei</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;