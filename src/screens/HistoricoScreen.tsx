import React from 'react';

const HistoricoScreen: React.FC = () => {
  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 sm:mb-6">Histórico de Sorteios</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
        <div className="text-center py-8 sm:py-12">
          <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 dark:text-gray-500 mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Nenhum histórico encontrado</h3>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 px-4">Os sorteios realizados aparecerão aqui para consulta futura.</p>
        </div>
      </div>
      
      <div className="mt-4 sm:mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4">
        <div className="flex items-start">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 dark:text-blue-300 mt-0.5 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-200">Funcionalidade em desenvolvimento</h4>
            <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 mt-1">
              Em breve você poderá visualizar o histórico completo dos sorteios realizados, 
              incluindo data, participantes e times formados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoricoScreen;