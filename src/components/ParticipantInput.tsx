import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import type { Participant } from '../utils/teamGenerator';

interface ParticipantInputProps {
  onAddParticipant: (participant: Participant) => void;
}

const ParticipantInput: React.FC<ParticipantInputProps> = ({ onAddParticipant }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddParticipant({ name: name.trim(), gender });
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col md:flex-row gap-2 md:gap-4">
      <div className="flex-grow">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome do participante"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          aria-label="Nome do participante"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setGender('male')}
          className={`flex-1 py-3 px-6 rounded-lg transition-colors ${
            gender === 'male'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Homem
        </button>
        <button
          type="button"
          onClick={() => setGender('female')}
          className={`flex-1 py-3 px-6 rounded-lg transition-colors ${
            gender === 'female'
              ? 'bg-pink-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Mulher
        </button>
      </div>
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
        disabled={!name.trim()}
      >
        <UserPlus className="mr-2 h-5 w-5" />
        Adicionar
      </button>
    </form>
  );
};

export default ParticipantInput;