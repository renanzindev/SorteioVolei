import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import SorteioScreen from './screens/SorteioScreen';
import HistoricoScreen from './screens/HistoricoScreen';
import ConfiguracoesScreen from './screens/ConfiguracoesScreen';
import EstatisticasScreen from './screens/EstatisticasScreen';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const [activeScreen, setActiveScreen] = useState<string>('sorteio');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'sorteio':
        return <SorteioScreen />;
      case 'historico':
        return <HistoricoScreen />;
      case 'configuracoes':
        return <ConfiguracoesScreen />;
      case 'estatisticas':
        return <EstatisticasScreen />;
      default:
        return <SorteioScreen />;
    }
  };

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:block`}>
        <Sidebar 
          activeScreen={activeScreen} 
          onScreenChange={(screen) => {
            setActiveScreen(screen);
            setIsMobileMenuOpen(false);
          }}
        />
      </div>
      
      <div className="flex flex-col flex-1 lg:ml-0">
        <Header 
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        
        <main className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {renderScreen()}
          </div>
        </main>
        
        <Footer />
      </div>
      </div>
    </ThemeProvider>
  );
}

export default App;