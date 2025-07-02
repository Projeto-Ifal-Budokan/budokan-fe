import { authService } from '@/lib/api/services/auth-service';
import { privilegesService } from '@/lib/api/services/privileges-service';
import {
  INSTRUCTOR_PRIVILEGES,
  PRIVILEGES,
  type PrivilegeType,
} from '@/types/privileges';

export interface SidebarItem {
  label: string;
  href: string;
  icon: string;
  privilege?: PrivilegeType;
  privileges?: PrivilegeType[];
  requireAll?: boolean;
}

const studentSidebarItems: SidebarItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'Home',
    privilege: PRIVILEGES.VIEW_DISCIPLINE,
  },
  {
    label: 'Meu Perfil',
    href: '/dashboard/profile',
    icon: 'User',
    privilege: PRIVILEGES.VIEW_USER,
  },
  {
    label: 'Minhas Modalidades',
    href: '/dashboard/my-disciplines',
    icon: 'BookOpen',
    privilege: PRIVILEGES.VIEW_DISCIPLINE,
  },
  {
    label: 'Aulas',
    href: '/dashboard/sessions',
    icon: 'Calendar',
    privilege: PRIVILEGES.VIEW_MATRICULATION,
  },
  {
    label: 'Frequência',
    href: '/dashboard/attendance',
    icon: 'UserCheck',
    privilege: PRIVILEGES.VIEW_MATRICULATION,
  },
  {
    label: 'Horários de Treino',
    href: '/dashboard/training-schedule',
    icon: 'Clock',
    privilege: PRIVILEGES.VIEW_DISCIPLINE,
  },
  {
    label: 'Comunidade',
    href: '/dashboard/community',
    icon: 'Users',
    privilege: PRIVILEGES.VIEW_USER,
  },
  {
    label: 'Ranking & Exames',
    href: '/dashboard/ranking',
    icon: 'Trophy',
    privileges: [PRIVILEGES.VIEW_RANK, PRIVILEGES.CREATE_RANK],
  },
];

const instructorSidebarItems: SidebarItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'Home',
    privilege: PRIVILEGES.VIEW_INSTRUCTOR_DISCIPLINE,
  },
  {
    label: 'Minhas Disciplinas',
    href: '/dashboard/my-disciplines',
    icon: 'BookOpen',
    privileges: [PRIVILEGES.LIST_DISCIPLINES, PRIVILEGES.VIEW_DISCIPLINE],
  },
  {
    label: 'Aulas',
    href: '/dashboard/sessions',
    icon: 'Calendar',
    privilege: PRIVILEGES.VIEW_INSTRUCTOR_DISCIPLINE,
  },
  {
    label: 'Controle de Frequência',
    href: '/dashboard/attendance',
    icon: 'UserCheck',
    privilege: PRIVILEGES.VIEW_MATRICULATION,
  },
  {
    label: 'Horários das Disciplinas',
    href: '/dashboard/discipline-schedule',
    icon: 'Clock',
    privilege: PRIVILEGES.VIEW_INSTRUCTOR_DISCIPLINE,
  },
  {
    label: 'Comunidade',
    href: '/dashboard/community',
    icon: 'Users',
    privileges: [PRIVILEGES.LIST_USERS, PRIVILEGES.VIEW_USER],
  },
  {
    label: 'Exames de Ranking',
    href: '/dashboard/ranking-exams',
    icon: 'Trophy',
    privileges: [PRIVILEGES.LIST_RANKS, PRIVILEGES.VIEW_RANK],
  },
  {
    label: 'Meu Perfil',
    href: '/dashboard/profile',
    icon: 'User',
    privilege: PRIVILEGES.VIEW_USER,
  },
];

const adminSidebarItems: SidebarItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'Home',
    privilege: PRIVILEGES.LIST_USERS,
  },
  {
    label: 'Meu Perfil',
    href: '/dashboard/profile',
    icon: 'User',
    privilege: PRIVILEGES.VIEW_USER,
  },
  {
    label: 'Usuários',
    href: '/dashboard/users',
    icon: 'Users',
    privileges: [
      PRIVILEGES.LIST_USERS,
      PRIVILEGES.VIEW_USER,
      PRIVILEGES.UPDATE_USER,
      PRIVILEGES.DELETE_USER,
    ],
  },
  {
    label: 'Papéis',
    href: '/dashboard/roles',
    icon: 'Shield',
    privileges: [
      PRIVILEGES.LIST_ROLES,
      PRIVILEGES.VIEW_ROLE,
      PRIVILEGES.CREATE_ROLE,
      PRIVILEGES.UPDATE_ROLE,
      PRIVILEGES.DELETE_ROLE,
    ],
  },
  {
    label: 'Privilégios',
    href: '/dashboard/privileges',
    icon: 'Key',
    privileges: [
      PRIVILEGES.LIST_PRIVILEGES,
      PRIVILEGES.VIEW_PRIVILEGE,
      PRIVILEGES.CREATE_PRIVILEGE,
      PRIVILEGES.UPDATE_PRIVILEGE,
      PRIVILEGES.DELETE_PRIVILEGE,
    ],
  },
  {
    label: 'Modalidades',
    href: '/dashboard/disciplines',
    icon: 'BookOpen',
    privileges: [
      PRIVILEGES.LIST_DISCIPLINES,
      PRIVILEGES.VIEW_DISCIPLINE,
      PRIVILEGES.CREATE_DISCIPLINE,
      PRIVILEGES.UPDATE_DISCIPLINE,
      PRIVILEGES.DELETE_DISCIPLINE,
    ],
  },
  {
    label: 'Aulas',
    href: '/dashboard/sessions',
    icon: 'Calendar',
    privileges: [
      PRIVILEGES.VIEW_INSTRUCTOR_DISCIPLINE,
      PRIVILEGES.VIEW_MATRICULATION,
    ],
  },
  {
    label: 'Horários de Treino',
    href: '/dashboard/training-schedules',
    icon: 'Clock',
    privileges: [
      PRIVILEGES.LIST_TRAINING_SCHEDULES,
      PRIVILEGES.VIEW_TRAINING_SCHEDULE,
      PRIVILEGES.CREATE_TRAINING_SCHEDULE,
      PRIVILEGES.UPDATE_TRAINING_SCHEDULE,
      PRIVILEGES.DELETE_TRAINING_SCHEDULE,
    ],
  },
  {
    label: ' Rankings',
    href: '/dashboard/rankings',
    icon: 'Trophy',
    privileges: [
      PRIVILEGES.LIST_RANKS,
      PRIVILEGES.VIEW_RANK,
      PRIVILEGES.CREATE_RANK,
      PRIVILEGES.UPDATE_RANK,
      PRIVILEGES.DELETE_RANK,
    ],
  },
  {
    label: ' Matrículas',
    href: '/dashboard/matriculations',
    icon: 'UserPlus',
    privileges: [
      PRIVILEGES.LIST_MATRICULATIONS,
      PRIVILEGES.VIEW_MATRICULATION,
      PRIVILEGES.CREATE_MATRICULATION,
      PRIVILEGES.UPDATE_MATRICULATION,
      PRIVILEGES.DELETE_MATRICULATION,
    ],
  },
  {
    label: 'Instrutores',
    href: '/dashboard/instructors',
    icon: 'Users',
    privileges: [
      PRIVILEGES.LIST_INSTRUCTOR_DISCIPLINES,
      PRIVILEGES.VIEW_INSTRUCTOR_DISCIPLINE,
      PRIVILEGES.CREATE_INSTRUCTOR_DISCIPLINE,
      PRIVILEGES.UPDATE_INSTRUCTOR_DISCIPLINE,
      PRIVILEGES.DELETE_INSTRUCTOR_DISCIPLINE,
    ],
  },
];

export async function getSidebarItems(): Promise<SidebarItem[]> {
  try {
    const response = await authService.me();

    if (!response.ok) {
      console.error('Failed to fetch user data:', response.status);
      return [];
    }

    const user = response.data;

    const userPrivilegesResponse = await privilegesService.getPrivilegesByUser(
      String(user.id)
    );

    if (!userPrivilegesResponse.ok) {
      console.error(
        'Failed to fetch user privileges:',
        userPrivilegesResponse.status
      );
      return [];
    }

    const userPrivileges = userPrivilegesResponse.data.items.map((p) => p.name);

    // Check if user has all privileges (admin)
    const allPrivileges = Object.values(PRIVILEGES);
    const isAdmin = allPrivileges.every((privilege) =>
      userPrivileges.includes(privilege)
    );

    // Check if user is instructor using the constant
    const isInstructor = INSTRUCTOR_PRIVILEGES.every((privilege) =>
      userPrivileges.includes(privilege)
    );

    if (isAdmin) {
      return adminSidebarItems;
    } else if (isInstructor) {
      return instructorSidebarItems;
    } else {
      return studentSidebarItems;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return [];
  }
}
