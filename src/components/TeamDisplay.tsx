import React from 'react';
import { Users, Scale as Male, Scale as Female } from 'lucide-react';
import type { Participant } from '../utils/teamGenerator';

interface TeamDisplayProps {
  teams: Participant[][];
}

const teamColors = [
  'bg-blue-100 border-blue-200',
  'bg-green-100 border-green-200',
  'bg-purple-100 border-purple-200',
  'bg-amber-100 border-amber-200',
  'bg-red-100 border-red-200',
  'bg-teal-100 border-teal-200',
  'bg-pink-100 border-pink-200',
  'bg-indigo-100 border-indigo-200',
];

const TeamDisplay: React.FC<TeamDisplayProps> = ({ teams }) => {
  if (!teams.length) {
    return null;
  }

  return (
    <div className="mt-8 animate-fade-in">
      <h2 className="text-xl font-medium text-gray-800 mb-4">Times Sorteados</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team, index) => {
          const men = team.filter(p => p.gender === 'male');
          const women = team.filter(p => p.gender === 'female');
          
          return (
            <div 
              key={index}
              className={`p-4 rounded-lg border ${teamColors[index % teamColors.length]} transition-all hover:shadow-md`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-gray-700" />
                  <h3 className="text-lg font-medium text-gray-800">Time {index + 1}</h3>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="flex items-center">
                    <Male className="h-4 w-4 text-blue-600 mr-1" />
                    {men.length}
                  </span>
                  <span className="flex items-center">
                    <Female className="h-4 w-4 text-pink-600 mr-1" />
                    {women.length}
                  </span>
                </div>
              </div>
              
              {men.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Male className="h-4 w-4 text-blue-600 mr-1" />
                    Homens
                  </h4>
                  <ul className="space-y-1">
                    {men.map((member, memberIndex) => (
                      <li key={memberIndex} className="py-1 px-2 bg-white bg-opacity-60 rounded text-sm">
                        {member.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {women.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Female className="h-4 w-4 text-pink-600 mr-1" />
                    Mulheres
                  </h4>
                  <ul className="space-y-1">
                    {women.map((member, memberIndex) => (
                      <li key={memberIndex} className="py-1 px-2 bg-white bg-opacity-60 rounded text-sm">
                        {member.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamDisplay;