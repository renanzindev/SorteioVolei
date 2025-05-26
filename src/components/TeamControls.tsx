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
    <div className="mt-8 p-5 bg-gray-50 rounded-lg border border-gray-200">
      <h2 className="text-lg font-medium text-gray-800 mb-4">Configuração dos Times</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="teamCount" className="block text-sm font-medium text-gray-700 mb-2">
            Número de Times
          </label>
          <input
            type="number"
            id="teamCount"
            value={teamCount}
            onChange={(e) => onTeamCountChange(parseInt(e.target.value) || 1)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all 
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Male className="h-4 w-4 text-blue-600 mr-1" />
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Female className="h-4 w-4 text-pink-600 mr-1" />
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={onGenerateTeams}
          disabled={participantsCount < 2}
          className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
        >
          <Shuffle className="mr-2 h-5 w-5" />
          {teamsGenerated ? 'Sortear Novamente' : 'Sortear Times'}
        </button>
        
        {teamsGenerated && (
          <button
            onClick={onCopyTeams}
            className="flex-1 md:flex-none bg-gray-700 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
          >
            <Copy className="mr-2 h-5 w-5" />
            Copiar
          </button>
        )}
      </div>
    </div>
  );
};

export default TeamControls;