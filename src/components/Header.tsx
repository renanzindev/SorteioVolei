import React from 'react';
import { Shuffle } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-gradient-to-r from-blue-600 to-blue-500 p-4 md:p-6 shadow-md">
      <div className="container mx-auto flex items-center justify-center md:justify-start">
        <Shuffle className="h-8 w-8 text-white mr-3" />
        <h1 className="text-2xl md:text-3xl font-bold text-white">Sorteador de Times</h1>
      </div>
    </header>
  );
};

export default Header;