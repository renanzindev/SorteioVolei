import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useLoading } from '../hooks/useLoading';

const ConfiguracoesScreen: React.FC = () => {
  const { showSuccess, showError, showWarning } = useToast();
  const { theme, setTheme } = useTheme();
  
  const [autoSave, setAutoSave] = useLocalStorage('app_autoSave', true, {
    validator: (data) => typeof data === 'boolean',
    fallbackValue: true
  });
  
  const [notifications, setNotifications] = useLocalStorage('app_notifications', false, {
    validator: (data) => typeof data === 'boolean',
    fallbackValue: false
  });
  
  const [language, setLanguage] = useLocalStorage('app_language', 'pt-BR', {
    validator: (data) => typeof data === 'string' && ['pt-BR', 'en-US', 'es-ES'].includes(data),
    fallbackValue: 'pt-BR'
  });

  const clearDataOperation = useLoading();

  const handleClearData = async () => {
    const confirmed = window.confirm('Tem certeza que deseja limpar todos os dados salvos? Esta ação não pode ser desfeita.');
    
    if (!confirmed) {
      return;
    }

    await clearDataOperation.execute(async () => {
      try {
        // Clear localStorage with error handling
        if (typeof Storage !== 'undefined') {
          localStorage.clear();
        } else {
          throw new Error('Armazenamento local não está disponível neste navegador.');
        }
        
        // Reset local state to defaults
        setAutoSave(true);
        setNotifications(false);
        setLanguage('pt-BR');
        
        return true;
      } catch (error) {
        throw new Error('Erro ao limpar dados. Tente novamente.');
      }
    }, {
      successMessage: 'Todos os dados foram limpos com sucesso!',
      errorMessage: 'Erro ao limpar dados. Verifique se o navegador permite acesso ao armazenamento local.'
    });
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
                onChange={(e) => {
                  try {
                    setTheme(e.target.value as any);
                    showSuccess('Tema alterado com sucesso!');
                  } catch (error) {
                    showError('Erro ao alterar tema', 'Não foi possível salvar a preferência de tema.');
                  }
                }}
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
                onChange={(e) => {
                  try {
                    setLanguage(e.target.value);
                    showSuccess('Idioma alterado com sucesso!');
                  } catch (error) {
                    showError('Erro ao alterar idioma', 'Não foi possível salvar a preferência de idioma.');
                  }
                }}
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
              disabled={clearDataOperation.isLoading}
              className="w-full px-4 py-2 text-sm sm:text-base bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {clearDataOperation.isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Limpando Dados...
                </>
              ) : (
                'Limpar Todos os Dados'
              )}
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