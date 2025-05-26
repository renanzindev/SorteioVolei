import React from 'react';
import { X, Scale as Male, Scale as Female } from 'lucide-react';
import type { Participant } from '../utils/teamGenerator';

interface ParticipantListProps {
  participants: Participant[];
  onRemoveParticipant: (index: number) => void;
}

const ParticipantList: React.FC<ParticipantListProps> = ({ 
  participants, 
  onRemoveParticipant 
}) => {
  if (participants.length === 0) {
    return (
      <div className="mt-6 p-6 border border-gray-200 border-dashed rounded-lg bg-gray-50 text-center">
        <p className="text-gray-500">Nenhum participante adicionado ainda.</p>
        <p className="text-sm text-gray-400 mt-1">Adicione participantes para começar.</p>
      </div>
    );
  }

  const menCount = participants.filter(p => p.gender === 'male').length;
  const womenCount = participants.filter(p => p.gender === 'female').length;

  return (
    <div className="mt-6">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-lg font-medium text-gray-800">
          Participantes ({participants.length})
        </h2>
        <div className="flex items-center gap-4">
          <span className="flex items-center text-sm text-gray-600">
            <Male className="h-4 w-4 text-blue-600 mr-1" />
            {menCount}
          </span>
          <span className="flex items-center text-sm text-gray-600">
            <Female className="h-4 w-4 text-pink-600 mr-1" />
            {womenCount}
          </span>
        </div>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {participants.map((participant, index) => (
          <li 
            key={index}
            className={`flex items-center justify-between p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow ${
              participant.gender === 'male' 
                ? 'bg-blue-50 border border-blue-200' 
                : 'bg-pink-50 border border-pink-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {participant.gender === 'male' ? (
                <Male className="h-4 w-4 text-blue-600" />
              ) : (
                <Female className="h-4 w-4 text-pink-600" />
              )}
              <span className="font-medium text-gray-700">{participant.name}</span>
            </div>
            <button
              onClick={() => onRemoveParticipant(index)}
              className="text-gray-400 hover:text-red-500 transition-colors"
              aria-label={`Remover ${participant.name}`}
            >
              <X className="h-5 w-5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ParticipantList;