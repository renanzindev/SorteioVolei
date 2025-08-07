import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ConfiguracoesScreen: React.FC = () => {
  const [autoSave, setAutoSave] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState('pt-BR');

  const handleClearData = () => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados salvos? Esta ação não pode ser desfeita.')) {
      localStorage.clear();
      alert('Dados limpos com sucesso!');
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 sm:mb-6">Configurações</h2>
      
      <div className="space-y-4 sm:space-y-6">
        {/* Configurações Gerais */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 sm:mb-4">Configurações Gerais</h3>
          
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-3">
                <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Salvamento Automático</label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Salvar automaticamente os dados dos participantes</p>
              </div>
              <button 
                onClick={() => setAutoSave(!autoSave)}
                className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                  autoSave ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                  autoSave ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-3">
                <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Notificações</label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Receber notificações sobre atualizações</p>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                  notifications ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                  notifications ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Aparência */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 sm:mb-4">Aparência</h3>
          
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tema</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
                <option value="auto">Automático</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Idioma</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dados */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 sm:mb-4">Gerenciar Dados</h3>
          
          <div className="space-y-3 sm:space-y-4">
            <button
              onClick={handleClearData}
              className="w-full px-4 py-2 text-sm sm:text-base bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Limpar Todos os Dados
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Esta ação removerá todos os participantes salvos e configurações. Esta ação não pode ser desfeita.
            </p>
          </div>
        </div>

        {/* Sobre */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 sm:mb-4">Sobre o App</h3>
          
          <div className="space-y-2">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Versão: 1.0.0</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Desenvolvido para facilitar o sorteio de times de vôlei</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">© 2024 Sorteio Vôlei</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracoesScreen;