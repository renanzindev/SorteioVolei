import React from 'react';
import { X, Scale as Male, Scale as Female, Star } from 'lucide-react';
import type { Participant, SkillLevel } from '../utils/teamGenerator';

interface ParticipantListProps {
  participants: Participant[];
  onRemoveParticipant: (index: number) => void;
}

const ParticipantList: React.FC<ParticipantListProps> = ({ 
  participants, 
  onRemoveParticipant 
}) => {
  const getSkillLevelDisplay = (skillLevel: SkillLevel) => {
    const skillConfig = {
      'iniciante': { stars: 1, color: 'text-gray-500', label: 'Iniciante' },
      'intermediario': { stars: 2, color: 'text-yellow-500', label: 'Intermediário' },
      'avancado': { stars: 3, color: 'text-orange-500', label: 'Avançado' },
      'profissional': { stars: 4, color: 'text-red-500', label: 'Profissional' }
    };
    
    const config = skillConfig[skillLevel];
    return {
      stars: Array(config.stars).fill(0),
      color: config.color,
      label: config.label
    };
  };
  if (participants.length === 0) {
    return (
      <div className="mt-4 sm:mt-6 p-4 sm:p-6 border border-gray-200 dark:border-gray-600 border-dashed rounded-lg bg-gray-50 dark:bg-gray-800 text-center">
        <p className="text-sm sm:text-base text-gray-500">Nenhum participante adicionado ainda.</p>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">Adicione participantes para começar.</p>
      </div>
    );
  }

  const menCount = participants.filter(p => p.gender === 'male').length;
  const womenCount = participants.filter(p => p.gender === 'female').length;

  return (
    <div className="mt-4 sm:mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-medium text-gray-800">
          Participantes ({participants.length})
        </h2>
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="flex items-center text-xs sm:text-sm text-gray-600">
            <Male className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 mr-1" />
            {menCount}
          </span>
          <span className="flex items-center text-xs sm:text-sm text-gray-600">
            <Female className="h-3 w-3 sm:h-4 sm:w-4 text-pink-600 mr-1" />
            {womenCount}
          </span>
        </div>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
        {participants.map((participant, index) => (
          <li 
            key={index}
            className={`flex items-center justify-between p-2 sm:p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow ${
              participant.gender === 'male' 
                ? 'bg-blue-50 border border-blue-200' 
                : 'bg-pink-50 border border-pink-200'
            }`}
          >
            <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
              {participant.gender === 'male' ? (
                <Male className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
              ) : (
                <Female className="h-3 w-3 sm:h-4 sm:w-4 text-pink-600 flex-shrink-0" />
              )}
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-medium text-gray-700 text-sm sm:text-base truncate">{participant.name}</span>
                <div className="flex items-center gap-1" title={getSkillLevelDisplay(participant.skillLevel).label}>
                  {getSkillLevelDisplay(participant.skillLevel).stars.map((_, starIndex) => (
                    <Star 
                      key={starIndex} 
                      className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${getSkillLevelDisplay(participant.skillLevel).color} fill-current`} 
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-1 hidden sm:inline">
                    {getSkillLevelDisplay(participant.skillLevel).label}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onRemoveParticipant(index)}
              className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 ml-2"
              aria-label={`Remover ${participant.name}`}
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ParticipantList;