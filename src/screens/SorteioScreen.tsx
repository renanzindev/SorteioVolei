import React, { useState, useEffect } from 'react';
import ParticipantInput from '../components/ParticipantInput';
import ParticipantList from '../components/ParticipantList';
import TeamControls from '../components/TeamControls';
import TeamDisplay from '../components/TeamDisplay';
import { generateTeams, formatTeamsForClipboard } from '../utils/teamGenerator';
import type { Participant, TeamRequirements } from '../utils/teamGenerator';

const SorteioScreen: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>(() => {
    const saved = localStorage.getItem('teamRandomizer_participants');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [teamCount, setTeamCount] = useState<number>(() => {
    const saved = localStorage.getItem('teamRandomizer_teamCount');
    return saved ? parseInt(saved) : 2;
  });

  const [requirements, setRequirements] = useState<TeamRequirements>(() => {
    const saved = localStorage.getItem('teamRandomizer_requirements');
    return saved ? JSON.parse(saved) : { menPerTeam: 0, womenPerTeam: 0 };
  });
  
  const [teams, setTeams] = useState<Participant[][]>([]);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('teamRandomizer_participants', JSON.stringify(participants));
  }, [participants]);
  
  useEffect(() => {
    localStorage.setItem('teamRandomizer_teamCount', teamCount.toString());
  }, [teamCount]);

  useEffect(() => {
    localStorage.setItem('teamRandomizer_requirements', JSON.stringify(requirements));
  }, [requirements]);
  
  const handleAddParticipant = (participant: Participant) => {
    if (!participants.some(p => p.name === participant.name)) {
      setParticipants([...participants, participant]);
      setError('');
    }
  };
  
  const handleRemoveParticipant = (index: number) => {
    const newParticipants = [...participants];
    newParticipants.splice(index, 1);
    setParticipants(newParticipants);
    setError('');
    
    if (newParticipants.length < 2) {
      setTeams([]);
    }
  };
  
  const handleTeamCountChange = (count: number) => {
    setTeamCount(count);
    setError('');
  };

  const handleRequirementsChange = (newRequirements: TeamRequirements) => {
    setRequirements(newRequirements);
    setError('');
  };
  
  const handleGenerateTeams = () => {
    if (participants.length >= 2) {
      try {
        const generatedTeams = generateTeams(participants, teamCount, requirements);
        setTeams(generatedTeams);
        setError('');
        
        setTimeout(() => {
          const teamsElement = document.getElementById('teams-section');
          if (teamsElement) {
            teamsElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao gerar times');
        setTeams([]);
      }
    }
  };
  
  const handleCopyTeams = () => {
    const formattedTeams = formatTeamsForClipboard(teams);
    navigator.clipboard.writeText(formattedTeams).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const menCount = participants.filter(p => p.gender === 'male').length;
  const womenCount = participants.filter(p => p.gender === 'female').length;

  return (
    <div className="p-4 sm:p-6">
      {/* Título principal maior como âncora visual */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-6 sm:mb-8 text-center">
        Sorteio de Times
      </h1>
      
      <div className="space-y-6 sm:space-y-8">
        {/* Seção de Participantes */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 sm:mb-6 flex items-center">
            <span className="w-2 h-6 bg-blue-500 rounded-full mr-3"></span>
            Adicionar Participantes
          </h2>
          <ParticipantInput onAddParticipant={handleAddParticipant} />
          <ParticipantList 
            participants={participants} 
            onRemoveParticipant={handleRemoveParticipant} 
          />
        </section>
        
        {/* Seção de Configuração dos Times com separação visual */}
        <section className="bg-gray-50 dark:bg-gray-800/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 sm:mb-6 flex items-center">
            <span className="w-2 h-6 bg-green-500 rounded-full mr-3"></span>
            Configuração dos Times
          </h2>
          <TeamControls 
            participantsCount={participants.length}
            menCount={menCount}
            womenCount={womenCount}
            teamCount={teamCount}
            requirements={requirements}
            onTeamCountChange={handleTeamCountChange}
            onRequirementsChange={handleRequirementsChange}
            onGenerateTeams={handleGenerateTeams}
            teamsGenerated={teams.length > 0}
            onCopyTeams={handleCopyTeams}
          />
          
          {error && (
            <div className="mt-4 p-3 sm:p-4 bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg text-sm sm:text-base">
              {error}
            </div>
          )}
        </section>
        
        {/* Seção de Exibição dos Times */}
        {teams.length > 0 && (
          <section id="teams-section" className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 sm:mb-6 flex items-center">
              <span className="w-2 h-6 bg-purple-500 rounded-full mr-3"></span>
              Times Gerados
            </h2>
            <TeamDisplay teams={teams} />
          </section>
        )}
        
        {copySuccess && (
          <div className="fixed bottom-4 right-4 bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-300 px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-md animate-fade-in text-sm sm:text-base">
            Times copiados para a área de transferência!
          </div>
        )}
      </div>
    </div>
  );
};

export default SorteioScreen;