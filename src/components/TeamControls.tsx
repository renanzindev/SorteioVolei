import React from 'react';
import { Shuffle, Copy, Scale as Male, Scale as Female } from 'lucide-react';
import type { TeamRequirements } from '../utils/teamGenerator';

interface TeamControlsProps {
  participantsCount: number;
  menCount: number;
  womenCount: number;
  teamCount: number;
  requirements: TeamRequirements;
  onTeamCountChange: (count: number) => void;
  onRequirementsChange: (requirements: TeamRequirements) => void;
  onGenerateTeams: () => void;
  teamsGenerated: boolean;
  onCopyTeams: () => void;
}

const TeamControls: React.FC<TeamControlsProps> = ({
  participantsCount,
  menCount,
  womenCount,
  teamCount,
  requirements,
  onTeamCountChange,
  onRequirementsChange,
  onGenerateTeams,
  teamsGenerated,
  onCopyTeams
}) => {
  return (
    <div className="mt-6 sm:mt-8 p-3 sm:p-5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-200 mb-3 sm:mb-4">Configuração dos Times</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div>
          <label htmlFor="teamCount" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Número de Times
          </label>
          <input
            type="number"
            id="teamCount"
            value={teamCount}
            onChange={(e) => onTeamCountChange(parseInt(e.target.value) || 1)}
            className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        <div>
          <label className="flex items-center text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Male className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 mr-1" />
            Homens por Time
          </label>
          <input
            type="number"
            min="0"
            max={menCount}
            value={requirements.menPerTeam}
            onChange={(e) => onRequirementsChange({
              ...requirements,
              menPerTeam: Math.max(0, parseInt(e.target.value) || 0)
            })}
            className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="sm:col-span-2 lg:col-span-1">
          <label className="flex items-center text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Female className="h-3 w-3 sm:h-4 sm:w-4 text-pink-600 mr-1" />
            Mulheres por Time
          </label>
          <input
            type="number"
            min="0"
            max={womenCount}
            value={requirements.womenPerTeam}
            onChange={(e) => onRequirementsChange({
              ...requirements,
              womenPerTeam: Math.max(0, parseInt(e.target.value) || 0)
            })}
            className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button
          onClick={onGenerateTeams}
          disabled={participantsCount < 2}
          className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 text-sm sm:text-base rounded-lg transition-all duration-200 flex items-center justify-center border-2 border-green-600 hover:border-green-700 disabled:border-gray-400 dark:disabled:border-gray-600 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:shadow-none"
        >
          <Shuffle className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden sm:inline">{teamsGenerated ? 'Sortear Novamente' : 'Sortear Times'}</span>
          <span className="sm:hidden">{teamsGenerated ? 'Novo Sorteio' : 'Sortear'}</span>
        </button>
        
        {teamsGenerated && (
          <button
            onClick={onCopyTeams}
            className="flex-1 sm:flex-none bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700 text-white font-medium py-2 px-4 sm:py-3 sm:px-6 text-sm sm:text-base rounded-lg transition-colors flex items-center justify-center border border-gray-700 hover:border-gray-800 dark:border-gray-600 dark:hover:border-gray-700"
          >
            <Copy className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Copiar
          </button>
        )}
      </div>
    </div>
  );
};

export default TeamControls;