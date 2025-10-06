import React, { useState } from 'react';
import ParticipantInput from '../components/ParticipantInput';
import ParticipantList from '../components/ParticipantList';
import TeamControls from '../components/TeamControls';
import TeamDisplay from '../components/TeamDisplay';
import TemplateManager from '../components/TemplateManager';
import { generateTeams, formatTeamsForClipboard } from '../utils/teamGenerator';
import type { Participant, TeamRequirements, SkillBalanceConfig, TemplateConfig } from '../utils/teamGenerator';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTeamGeneration, useCopyOperation } from '../hooks/useLoading';
import { useToast } from '../contexts/ToastContext';

const SorteioScreen: React.FC = () => {
  const { showError, showWarning } = useToast();
  
  // Validators for localStorage data
  const validateParticipants = (data: any): boolean => {
    return Array.isArray(data) && data.every(p => 
      p && typeof p.name === 'string' && 
      (p.gender === 'male' || p.gender === 'female') &&
      (p.skillLevel === 'iniciante' || p.skillLevel === 'intermediario' || 
       p.skillLevel === 'avancado' || p.skillLevel === 'profissional')
    );
  };
  
  const validateTeamCount = (data: any): boolean => {
    return typeof data === 'number' && data >= 2 && data <= 20;
  };
  
  const validateRequirements = (data: any): boolean => {
    return data && typeof data === 'object' && 
           typeof data.menPerTeam === 'number' && 
           typeof data.womenPerTeam === 'number' &&
           data.menPerTeam >= 0 && data.womenPerTeam >= 0;
  };

  // Use localStorage hooks with validation
  const [participants, setParticipants] = useLocalStorage<Participant[]>(
    'teamRandomizer_participants', 
    [], 
    { 
      validator: validateParticipants,
      fallbackValue: []
    }
  );
  
  const [teamCount, setTeamCount] = useLocalStorage<number>(
    'teamRandomizer_teamCount', 
    2, 
    { 
      validator: validateTeamCount,
      fallbackValue: 2
    }
  );

  const [requirements, setRequirements] = useLocalStorage<TeamRequirements>(
    'teamRandomizer_requirements', 
    { menPerTeam: 0, womenPerTeam: 0 }, 
    { 
      validator: validateRequirements,
      fallbackValue: { menPerTeam: 0, womenPerTeam: 0 }
    }
  );

  const [teams, setTeams] = useState<Participant[][]>([]);
  
  // Skill balance configuration
  const [skillConfig, setSkillConfig] = useLocalStorage<SkillBalanceConfig>(
    'teamRandomizer_skillConfig',
    { enabled: false, strategy: 'balanced' },
    {
      validator: (data: any) => 
        data && typeof data === 'object' &&
        typeof data.enabled === 'boolean' &&
        (data.strategy === 'balanced' || data.strategy === 'mixed' || data.strategy === 'random'),
      fallbackValue: { enabled: false, strategy: 'balanced' }
    }
  );
  
  // Loading hooks for async operations
  const teamGeneration = useTeamGeneration();
  const copyOperation = useCopyOperation();
  
  const handleAddParticipant = (participant: Participant) => {
    // Validate participant data
    if (!participant.name || participant.name.trim().length < 2) {
      showError('Nome Inválido', 'O nome deve ter pelo menos 2 caracteres.');
      return;
    }
    
    if (participant.name.trim().length > 50) {
      showError('Nome Muito Longo', 'O nome deve ter no máximo 50 caracteres.');
      return;
    }
    
    // Check for duplicate names (case insensitive)
    const duplicateExists = participants.some(p => 
      p.name.toLowerCase().trim() === participant.name.toLowerCase().trim()
    );
    
    if (duplicateExists) {
      showWarning('Participante Duplicado', `"${participant.name}" já foi adicionado à lista.`);
      return;
    }
    
    // Check maximum participants limit
    if (participants.length >= 100) {
      showError('Limite Excedido', 'Máximo de 100 participantes permitidos.');
      return;
    }
    
    setParticipants([...participants, { ...participant, name: participant.name.trim() }]);
  };
  
  const handleRemoveParticipant = (index: number) => {
    if (index < 0 || index >= participants.length) {
      showError('Erro Interno', 'Índice de participante inválido.');
      return;
    }
    
    const newParticipants = [...participants];
    const removedParticipant = newParticipants.splice(index, 1);
    setParticipants(newParticipants);
    
    // Clear teams if not enough participants
    if (newParticipants.length < 2) {
      setTeams([]);
    }
  };
  
  const handleTeamCountChange = (count: number) => {
    if (count < 2) {
      showError('Número Inválido', 'É necessário pelo menos 2 times.');
      return;
    }
    
    if (count > participants.length) {
      showWarning('Muitos Times', 'Número de times não pode ser maior que o número de participantes.');
      return;
    }
    
    setTeamCount(count);
  };

  const handleRequirementsChange = (newRequirements: TeamRequirements) => {
    const menCount = participants.filter(p => p.gender === 'male').length;
    const womenCount = participants.filter(p => p.gender === 'female').length;
    
    // Validate requirements
    if (newRequirements.menPerTeam * teamCount > menCount) {
      showWarning(
        'Requisitos Impossíveis', 
        `Não há homens suficientes. Disponível: ${menCount}, Necessário: ${newRequirements.menPerTeam * teamCount}`
      );
      return;
    }
    
    if (newRequirements.womenPerTeam * teamCount > womenCount) {
      showWarning(
        'Requisitos Impossíveis', 
        `Não há mulheres suficientes. Disponível: ${womenCount}, Necessário: ${newRequirements.womenPerTeam * teamCount}`
      );
      return;
    }
    
    setRequirements(newRequirements);
  };
  
  const handleGenerateTeams = async () => {
    if (participants.length < 2) {
      showError('Participantes Insuficientes', 'É necessário pelo menos 2 participantes para gerar times.');
      return;
    }
    
    if (participants.length < teamCount) {
      showError('Muitos Times', 'Número de times não pode ser maior que o número de participantes.');
      return;
    }
    
    await teamGeneration.execute(async () => {
      const generatedTeams = generateTeams(participants, teamCount, requirements, skillConfig);
      setTeams(generatedTeams);
      
      // Scroll to teams section after a short delay
      setTimeout(() => {
        const teamsElement = document.getElementById('teams-section');
        if (teamsElement) {
          teamsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      
      return generatedTeams;
    }, {
      successMessage: `${teamCount} times gerados com sucesso!`,
      errorMessage: 'Erro ao gerar times. Verifique as configurações e tente novamente.'
    });
  };

  const handleLoadTemplate = (config: TemplateConfig) => {
    setTeamCount(config.teamCount);
    setRequirements(config.requirements ?? { menPerTeam: 0, womenPerTeam: 0 });
    setSkillConfig(config.skillConfig ?? { enabled: false, strategy: 'balanced' });
  };
  
  const handleCopyTeams = async () => {
    if (teams.length === 0) {
      showError('Nenhum Time', 'Não há times para copiar. Gere os times primeiro.');
      return;
    }
    
    await copyOperation.execute(async () => {
      const formattedTeams = formatTeamsForClipboard(teams, skillConfig.enabled);
      
      if (!navigator.clipboard) {
        throw new Error('Área de transferência não disponível neste navegador.');
      }
      
      await navigator.clipboard.writeText(formattedTeams);
      return formattedTeams;
    }, {
      successMessage: 'Times copiados para a área de transferência!',
      errorMessage: 'Erro ao copiar times. Tente novamente.'
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
        
        {/* Seção de Templates */}
        <section className="bg-purple-50 dark:bg-purple-900/20 rounded-lg shadow-sm border border-purple-200 dark:border-purple-700 p-4 sm:p-6">
          <TemplateManager 
            currentConfig={{
              teamCount,
              requirements,
              skillConfig
            }}
            onLoadTemplate={handleLoadTemplate}
          />
        </section>
        
        {/* Seção de Configuração de Habilidades */}
        <section className="bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-sm border border-blue-200 dark:border-blue-700 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 sm:mb-6 flex items-center">
            <span className="w-2 h-6 bg-blue-500 rounded-full mr-3"></span>
            Balanceamento por Habilidade
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="skillBalanceEnabled"
                checked={skillConfig.enabled}
                onChange={(e) => setSkillConfig({ ...skillConfig, enabled: e.target.checked })}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="skillBalanceEnabled" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Ativar balanceamento por nível de habilidade
              </label>
            </div>
            
            {skillConfig.enabled && (
              <div className="ml-7 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estratégia de Balanceamento:
                  </label>
                  <select
                    value={skillConfig.strategy}
                    onChange={(e) => setSkillConfig({ ...skillConfig, strategy: e.target.value as 'balanced' | 'mixed' | 'random' })}
                    className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="balanced">⚖️ Equilibrado - Distribui habilidades uniformemente</option>
                    <option value="mixed">🔀 Misto - Mistura aleatória com balanceamento</option>
                    <option value="random">🎲 Aleatório - Ignora habilidades</option>
                  </select>
                </div>
                
                <div className="text-xs text-gray-600 dark:text-gray-400 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                  <strong>Equilibrado:</strong> Cada time terá uma distribuição similar de níveis de habilidade.<br/>
                  <strong>Misto:</strong> Combina balanceamento com aleatoriedade para variedade.<br/>
                  <strong>Aleatório:</strong> Distribui participantes aleatoriamente, ignorando habilidades.
                </div>
              </div>
            )}
          </div>
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
            isGenerating={teamGeneration.isLoading}
            isCopying={copyOperation.isLoading}
          />
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
        

      </div>
    </div>
  );
};

export default SorteioScreen;