import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-6 text-center text-gray-500 text-sm">
      <p>© {new Date().getFullYear()} Sorteador de Times. Todos os direitos reservados.</p>
    </footer>
  );
};

export default Footer;