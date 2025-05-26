interface Participant {
  name: string;
  gender: 'male' | 'female';
}

interface TeamRequirements {
  menPerTeam: number;
  womenPerTeam: number;
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
 * Generates teams by randomly distributing participants while respecting gender requirements
 */
export const generateTeams = (
  participants: Participant[], 
  teamCount: number,
  requirements?: TeamRequirements
): Participant[][] => {
  if (participants.length < teamCount) {
    throw new Error('O número de participantes deve ser pelo menos igual ao número de equipes');
  }

  // If no requirements specified, distribute evenly
  if (!requirements) {
    const shuffledParticipants = shuffleArray(participants);
    const teams: Participant[][] = Array.from({ length: teamCount }, () => []);
    shuffledParticipants.forEach((participant, index) => {
      const teamIndex = index % teamCount;
      teams[teamIndex].push(participant);
    });
    return teams;
  }

  // Separate participants by gender
  const men = participants.filter(p => p.gender === 'male');
  const women = participants.filter(p => p.gender === 'female');

  // Validate if we have enough participants of each gender
  const totalMenNeeded = requirements.menPerTeam * teamCount;
  const totalWomenNeeded = requirements.womenPerTeam * teamCount;

  if (men.length < totalMenNeeded) {
    throw new Error(`Não há homens suficientes. Necessário: ${totalMenNeeded}, Disponível: ${men.length}`);
  }

  if (women.length < totalWomenNeeded) {
    throw new Error(`Não há mulheres suficientes. Necessário: ${totalWomenNeeded}, Disponível: ${women.length}`);
  }

  // Shuffle both groups
  const shuffledMen = shuffleArray(men);
  const shuffledWomen = shuffleArray(women);

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
export const formatTeamsForClipboard = (teams: Participant[][]): string => {
  return teams.map((team, index) => {
    const men = team.filter(p => p.gender === 'male');
    const women = team.filter(p => p.gender === 'female');
    
    return `Time ${index + 1}:\n` +
      (men.length ? `Homens:\n${men.map(p => `- ${p.name}`).join('\n')}\n` : '') +
      (women.length ? `Mulheres:\n${women.map(p => `- ${p.name}`).join('\n')}` : '');
  }).join('\n\n');
};

export type { Participant, TeamRequirements };