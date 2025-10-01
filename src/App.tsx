import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SorteioScreen from './screens/SorteioScreen';
import HistoricoScreen from './screens/HistoricoScreen';
import ConfiguracoesScreen from './screens/ConfiguracoesScreen';
import EstatisticasScreen from './screens/EstatisticasScreen';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const [activeScreen, setActiveScreen] = useState<string>('sorteio');

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
      <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
        <Header />
        
        <main className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {renderScreen()}
          </div>
        </main>
        
        <Footer 
          activeScreen={activeScreen}
          onScreenChange={setActiveScreen}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;