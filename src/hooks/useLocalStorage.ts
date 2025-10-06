import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../contexts/ToastContext';

type SetValue<T> = T | ((val: T) => T);

interface UseLocalStorageOptions {
  serialize?: (value: any) => string;
  deserialize?: (value: string) => any;
  validator?: (value: any) => boolean;
  fallbackValue?: any;
  showErrorToast?: boolean;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions = {}
): [T, (value: SetValue<T>) => void, { error: string | null; isSupported: boolean }] {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    validator,
    fallbackValue = initialValue,
    showErrorToast = true
  } = options;

  const { showError, showWarning } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  // Check if localStorage is supported
  const checkLocalStorageSupport = useCallback(() => {
    try {
      const testKey = '__localStorage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }, []);

  // Initialize state
  const [storedValue, setStoredValue] = useState<T>(() => {
    const supported = checkLocalStorageSupport();
    setIsSupported(supported);

    if (!supported) {
      if (showErrorToast) {
        showWarning(
          'Armazenamento Local Indisponível',
          'Os dados não serão salvos entre sessões. Verifique as configurações do navegador.'
        );
      }
      return fallbackValue;
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return initialValue;
      }

      const parsed = deserialize(item);
      
      // Validate the parsed value if validator is provided
      if (validator && !validator(parsed)) {
        console.warn(`Invalid data found in localStorage for key "${key}". Using fallback value.`);
        if (showErrorToast) {
          showWarning(
            'Dados Corrompidos',
            `Os dados salvos para "${key}" estão corrompidos. Usando valores padrão.`
          );
        }
        return fallbackValue;
      }

      return parsed;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error(`Error reading localStorage key "${key}":`, err);
      setError(errorMessage);
      
      if (showErrorToast) {
        showError(
          'Erro ao Carregar Dados',
          `Não foi possível carregar os dados salvos: ${errorMessage}`
        );
      }
      
      return fallbackValue;
    }
  });

  // Update localStorage when state changes
  const setValue = useCallback((value: SetValue<T>) => {
    try {
      setError(null);
      
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Validate the value if validator is provided
      if (validator && !validator(valueToStore)) {
        const errorMsg = 'Valor inválido fornecido para armazenamento';
        setError(errorMsg);
        if (showErrorToast) {
          showError('Erro de Validação', errorMsg);
        }
        return;
      }

      setStoredValue(valueToStore);

      // Save to localStorage if supported
      if (isSupported) {
        try {
          localStorage.setItem(key, serialize(valueToStore));
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
          console.error(`Error setting localStorage key "${key}":`, err);
          setError(errorMessage);
          
          if (showErrorToast) {
            if (errorMessage.includes('QuotaExceededError') || errorMessage.includes('quota')) {
              showError(
                'Armazenamento Cheio',
                'Não há espaço suficiente para salvar os dados. Considere limpar dados antigos.'
              );
            } else {
              showError(
                'Erro ao Salvar',
                `Não foi possível salvar os dados: ${errorMessage}`
              );
            }
          }
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error(`Error in setValue for key "${key}":`, err);
      setError(errorMessage);
      
      if (showErrorToast) {
        showError('Erro Interno', `Erro inesperado: ${errorMessage}`);
      }
    }
  }, [key, serialize, storedValue, validator, isSupported, showError, showErrorToast]);

  // Listen for localStorage changes from other tabs/windows
  useEffect(() => {
    if (!isSupported) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = deserialize(e.newValue);
          if (!validator || validator(newValue)) {
            setStoredValue(newValue);
          }
        } catch (err) {
          console.error(`Error handling storage change for key "${key}":`, err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, deserialize, validator, isSupported]);

  return [storedValue, setValue, { error, isSupported }];
}

// Utility function to clear all app data with confirmation
export const useClearAppData = () => {
  const { showSuccess, showError } = useToast();

  return useCallback((keys: string[] = []) => {
    try {
      if (keys.length > 0) {
        // Clear specific keys
        keys.forEach(key => {
          try {
            localStorage.removeItem(key);
          } catch (err) {
            console.error(`Error removing localStorage key "${key}":`, err);
          }
        });
      } else {
        // Clear all localStorage
        localStorage.clear();
      }
      
      showSuccess(
        'Dados Limpos',
        'Todos os dados foram removidos com sucesso.'
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('Error clearing localStorage:', err);
      showError(
        'Erro ao Limpar Dados',
        `Não foi possível limpar os dados: ${errorMessage}`
      );
    }
  }, [showSuccess, showError]);
};