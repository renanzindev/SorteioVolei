import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ParticipantInput from './components/ParticipantInput';
import ParticipantList from './components/ParticipantList';
import TeamControls from './components/TeamControls';
import TeamDisplay from './components/TeamDisplay';
import Footer from './components/Footer';
import { generateTeams, formatTeamsForClipboard } from './utils/teamGenerator';
import type { Participant, TeamRequirements } from './utils/teamGenerator';

function App() {
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
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Adicionar Participantes</h2>
            <ParticipantInput onAddParticipant={handleAddParticipant} />
            <ParticipantList 
              participants={participants} 
              onRemoveParticipant={handleRemoveParticipant} 
            />
          </section>
          
          <section>
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
              <div className="mt-4 p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}
          </section>
          
          <section id="teams-section">
            <TeamDisplay teams={teams} />
          </section>
          
          {copySuccess && (
            <div className="fixed bottom-4 right-4 bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-md animate-fade-in">
              Times copiados para a área de transferência!
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;