export type SkillLevel = 'iniciante' | 'intermediario' | 'avancado' | 'profissional';

interface Participant {
  name: string;
  gender: 'male' | 'female';
  skillLevel: SkillLevel;
}

interface TeamRequirements {
  menPerTeam: number;
  womenPerTeam: number;
}

interface SkillBalanceConfig {
  enabled: boolean;
  strategy: 'balanced' | 'mixed' | 'random';
}

interface TeamTemplate {
  id: string;
  name: string;
  description?: string;
  teamCount: number;
  requirements: TeamRequirements | null;
  skillConfig: SkillBalanceConfig;
  createdAt: Date;
  lastUsed?: Date;
}

interface TemplateConfig {
  teamCount: number;
  requirements?: TeamRequirements | null;
  skillConfig?: SkillBalanceConfig;
}

/**
 * Shuffles an array using the Fisher-Yates algorithm
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Gets skill level weight for balancing
 */
const getSkillWeight = (skillLevel: SkillLevel): number => {
  const weights = {
    'iniciante': 1,
    'intermediario': 2,
    'avancado': 3,
    'profissional': 4
  };
  return weights[skillLevel];
};

/**
 * Calculates team skill balance score
 */
const calculateTeamSkillScore = (team: Participant[]): number => {
  return team.reduce((total, participant) => total + getSkillWeight(participant.skillLevel), 0);
};

/**
 * Groups participants by skill level
 */
const groupBySkillLevel = (participants: Participant[]): Record<SkillLevel, Participant[]> => {
  return participants.reduce((groups, participant) => {
    const skill = participant.skillLevel;
    if (!groups[skill]) {
      groups[skill] = [];
    }
    groups[skill].push(participant);
    return groups;
  }, {} as Record<SkillLevel, Participant[]>);
};

/**
 * Distributes participants by skill level to balance teams
 */
const distributeBySkill = (participants: Participant[], teamCount: number): Participant[][] => {
  const skillGroups = groupBySkillLevel(participants);
  const teams: Participant[][] = Array.from({ length: teamCount }, () => []);
  
  // Distribute each skill level evenly across teams
  Object.values(skillGroups).forEach(skillGroup => {
    const shuffled = shuffleArray(skillGroup);
    shuffled.forEach((participant, index) => {
      const teamIndex = index % teamCount;
      teams[teamIndex].push(participant);
    });
  });
  
  return teams;
};

/**
 * Generates teams by randomly distributing participants while respecting gender requirements and skill balance
 */
export const generateTeams = (
  participants: Participant[], 
  teamCount: number,
  requirements?: TeamRequirements,
  skillConfig?: SkillBalanceConfig
): Participant[][] => {
  if (participants.length < teamCount) {
    throw new Error('O número de participantes deve ser pelo menos igual ao número de equipes');
  }

  // If no requirements specified, distribute evenly (with optional skill balancing)
  if (!requirements) {
    if (skillConfig?.enabled && skillConfig.strategy === 'balanced') {
      return distributeBySkill(participants, teamCount);
    } else {
      const shuffledParticipants = shuffleArray(participants);
      const teams: Participant[][] = Array.from({ length: teamCount }, () => []);
      shuffledParticipants.forEach((participant, index) => {
        const teamIndex = index % teamCount;
        teams[teamIndex].push(participant);
      });
      return teams;
    }
  }

  // Separate participants by gender
  const men = participants.filter(p => p.gender === 'male');
  const women = participants.filter(p => p.gender === 'female');

  // Validate if we have enough participants of each gender - Relaxed validation
  const totalMenNeeded = requirements.menPerTeam * teamCount;
  const totalWomenNeeded = requirements.womenPerTeam * teamCount;

  // Removed strict error throwing for insufficient players based on requirements
  // if (men.length < totalMenNeeded) {
  //   throw new Error(`Não há homens suficientes. Necessário: ${totalMenNeeded}, Disponível: ${men.length}`);
  // }

  // if (women.length < totalWomenNeeded) {
  //   throw new Error(`Não há mulheres suficientes. Necessário: ${totalWomenNeeded}, Disponível: ${women.length}`);
  // }

  // Apply skill balancing if enabled
  let shuffledMen: Participant[];
  let shuffledWomen: Participant[];
  
  if (skillConfig?.enabled && skillConfig.strategy === 'balanced') {
    // Distribute men and women separately by skill level
    const menTeams = distributeBySkill(men, teamCount);
    const womenTeams = distributeBySkill(women, teamCount);
    
    // Flatten back to arrays for existing logic
    shuffledMen = menTeams.flat();
    shuffledWomen = womenTeams.flat();
  } else {
    shuffledMen = shuffleArray(men);
    shuffledWomen = shuffleArray(women);
  }

  // Create teams with required distribution
  const teams: Participant[][] = Array.from({ length: teamCount }, () => []);
  
  // Distribute men
  for (let i = 0; i < teamCount; i++) {
    const start = i * requirements.menPerTeam;
    const end = start + requirements.menPerTeam;
    teams[i].push(...shuffledMen.slice(start, end));
  }

  // Distribute women
  for (let i = 0; i < teamCount; i++) {
    const start = i * requirements.womenPerTeam;
    const end = start + requirements.womenPerTeam;
    teams[i].push(...shuffledWomen.slice(start, end));
  }

  // Distribute remaining participants evenly
  const remainingMen = shuffledMen.slice(totalMenNeeded);
  const remainingWomen = shuffledWomen.slice(totalWomenNeeded);
  const remaining = shuffleArray([...remainingMen, ...remainingWomen]);

  remaining.forEach((participant, index) => {
    const teamIndex = index % teamCount;
    teams[teamIndex].push(participant);
  });

  return teams;
};

/**
 * Formats teams for clipboard copying
 */
export const formatTeamsForClipboard = (teams: Participant[][], includeSkills: boolean = false): string => {
  return teams.map((team, index) => {
    const men = team.filter(p => p.gender === 'male');
    const women = team.filter(p => p.gender === 'female');
    
    const formatParticipant = (p: Participant) => 
      includeSkills ? `- ${p.name} (${p.skillLevel})` : `- ${p.name}`;
    
    const teamScore = includeSkills ? calculateTeamSkillScore(team) : 0;
    const scoreText = includeSkills ? ` (Pontuação: ${teamScore})` : '';
    
    return `Time ${index + 1}${scoreText}:\n` +
      (men.length ? `Homens:\n${men.map(formatParticipant).join('\n')}\n` : '') +
      (women.length ? `Mulheres:\n${women.map(formatParticipant).join('\n')}` : '');
  }).join('\n\n');
};

export type { Participant, TeamRequirements, SkillBalanceConfig, TeamTemplate, TemplateConfig };