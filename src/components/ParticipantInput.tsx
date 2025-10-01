import React, { useState, useEffect } from 'react';
import { UserPlus, Sparkles } from 'lucide-react';
import type { Participant } from '../utils/teamGenerator';
import { detect } from 'gender-detection';

interface ParticipantInputProps {
  onAddParticipant: (participant: Participant) => void;
}

const ParticipantInput: React.FC<ParticipantInputProps> = ({ onAddParticipant }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [isAutoDetected, setIsAutoDetected] = useState(false);

  // Auto-detect gender when name changes
  useEffect(() => {
    if (name.trim()) {
      const firstName = name.trim().split(' ')[0];
      const detectedGender = detect(firstName);
      
      if (detectedGender === 'male' || detectedGender === 'female') {
        setGender(detectedGender);
        setIsAutoDetected(true);
      } else {
        // If detection returns 'unisex' or 'unknown', don't auto-detect
        setIsAutoDetected(false);
      }
    } else {
      setIsAutoDetected(false);
    }
  }, [name]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddParticipant({ name: name.trim(), gender });
      setName('');
      setIsAutoDetected(false);
    }
  };

  const handleGenderSelect = (selectedGender: 'male' | 'female') => {
    setGender(selectedGender);
    setIsAutoDetected(false); // Manual selection overrides auto-detection
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-3 sm:gap-4">
      <div className="flex-grow">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome do participante"
          className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          aria-label="Nome do participante"
        />
      </div>
      <div className="flex flex-col gap-2">
        {isAutoDetected && (
          <div className="flex items-center justify-center text-xs text-green-600 dark:text-green-400">
            <Sparkles className="h-3 w-3 mr-1" />
            <span>Gênero detectado automaticamente</span>
          </div>
        )}
        <div className="flex gap-2 sm:gap-2">
          <button
            type="button"
            onClick={() => handleGenderSelect('male')}
            className={`flex-1 py-2 px-3 sm:py-3 sm:px-6 text-xs sm:text-sm rounded-lg transition-colors border ${
              gender === 'male'
                ? `${isAutoDetected ? 'bg-green-600 border-green-600' : 'bg-blue-600 border-blue-600'} text-white`
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600'
            }`}
          >
            {isAutoDetected && gender === 'male' && <Sparkles className="inline h-3 w-3 mr-1" />}
            Homem
          </button>
          <button
            type="button"
            onClick={() => handleGenderSelect('female')}
            className={`flex-1 py-2 px-3 sm:py-3 sm:px-6 text-xs sm:text-sm rounded-lg transition-colors border ${
              gender === 'female'
                ? `${isAutoDetected ? 'bg-green-600 border-green-600' : 'bg-pink-600 border-pink-600'} text-white`
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600'
            }`}
          >
            {isAutoDetected && gender === 'female' && <Sparkles className="inline h-3 w-3 mr-1" />}
            Mulher
          </button>
        </div>
      </div>
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white font-medium py-2 px-4 sm:py-3 sm:px-6 text-sm sm:text-base rounded-lg transition-colors flex items-center justify-center min-w-0 border border-blue-600 hover:border-blue-700 disabled:border-gray-400 dark:disabled:border-gray-600"
        disabled={!name.trim()}
      >
        <UserPlus className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
        <span className="hidden sm:inline">Adicionar</span>
        <span className="sm:hidden">+</span>
      </button>
    </form>
  );
};

export default ParticipantInput;