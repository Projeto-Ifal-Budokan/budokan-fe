export interface TeamMember {
  githubUsername: string;
  role: string;
}

export const teamMembers: TeamMember[] = [
  {
    githubUsername: 'Casterrr',
    role: 'Designer UI/UX e Backend Developer',
  },
  {
    githubUsername: 'HeevOL',
    role: 'Full Stack Developer',
  },
  {
    githubUsername: 'filipezaidan',
    role: 'Full Stack Developer & Devops',
  },
  {
    githubUsername: 'Maelton',
    role: 'Frontend Developer',
  },
  {
    githubUsername: 'emessonhoracio',
    role: 'Devops',
  },
];

// Filter active members and sort by priority
export const getActiveTeamMembers = (): TeamMember[] => {
  return teamMembers;
};

// Get team statistics
export const getTeamStats = () => {
  const activeMembers = getActiveTeamMembers();

  return {
    totalMembers: activeMembers.length,
  };
};
