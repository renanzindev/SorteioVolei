import { useState, useCallback } from 'react';
import { useToast } from '../contexts/ToastContext';

interface UseLoadingOptions {
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

interface LoadingState {
  isLoading: boolean;
  error: string | null;
  data: any;
}

export function useLoading<T = any>(options: UseLoadingOptions = {}) {
  const {
    showErrorToast = true,
    showSuccessToast = false,
    successMessage = 'Operação realizada com sucesso',
    errorMessage = 'Ocorreu um erro durante a operação'
  } = options;

  const { showError, showSuccess } = useToast();
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    error: null,
    data: null
  });

  const execute = useCallback(async (
    asyncFunction: () => Promise<T>,
    customOptions?: {
      successMessage?: string;
      errorMessage?: string;
      showErrorToast?: boolean;
      showSuccessToast?: boolean;
    }
  ): Promise<T | null> => {
    const opts = { ...options, ...customOptions };
    
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      const result = await asyncFunction();
      
      setState({
        isLoading: false,
        error: null,
        data: result
      });

      if (opts.showSuccessToast) {
        showSuccess('Sucesso', opts.successMessage || successMessage);
      }

      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
      
      setState({
        isLoading: false,
        error: errorMsg,
        data: null
      });

      if (opts.showErrorToast) {
        showError('Erro', opts.errorMessage || errorMessage);
      }

      console.error('Error in useLoading:', err);
      return null;
    }
  }, [showError, showSuccess, options, successMessage, errorMessage]);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      data: null
    });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({
      ...prev,
      isLoading: loading
    }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({
      ...prev,
      error,
      isLoading: false
    }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setLoading,
    setError
  };
}

// Hook específico para operações de geração de times
export function useTeamGeneration() {
  return useLoading({
    showErrorToast: true,
    showSuccessToast: true,
    successMessage: 'Times gerados com sucesso!',
    errorMessage: 'Erro ao gerar times'
  });
}

// Hook específico para operações de cópia
export function useCopyOperation() {
  return useLoading({
    showErrorToast: true,
    showSuccessToast: true,
    successMessage: 'Copiado para a área de transferência!',
    errorMessage: 'Erro ao copiar para a área de transferência'
  });
}