import { api } from '@/lib/api/client';
import { User } from '@/types/user';

export interface SidebarItem {
  label: string;
  href: string;
  icon: string;
  privilege?: string;
  privileges?: string[];
  requireAll?: boolean;
}

const sidebarItems: SidebarItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'Home',
    privilege: 'view_discipline',
  },

  // Seção Aluno
  {
    label: 'Modalidades',
    href: '/dashboard/modalidades',
    icon: 'BookOpen',
    privilege: 'view_discipline',
  },
  {
    label: 'Aulas',
    href: '/dashboard/aulas',
    icon: 'Calendar',
    privileges: ['view_matriculation', 'view_instructor_discipline'],
  },
  {
    label: 'Frequência',
    href: '/dashboard/frequencia',
    icon: 'UserCheck',
    privilege: 'view_matriculation',
  },
  {
    label: 'Pagamentos',
    href: '/dashboard/pagamentos',
    icon: 'CreditCard',
    privilege: 'view_matriculation',
  },
  {
    label: 'Ranking',
    href: '/dashboard/ranking',
    icon: 'Trophy',
    privilege: 'view_rank',
  },

  // Seção Instrutor
  {
    label: 'Gerenciar Aulas',
    href: '/dashboard/instrutor/aulas',
    icon: 'Calendar',
    privilege: 'view_instructor_discipline',
  },
  {
    label: 'Frequência das Turmas',
    href: '/dashboard/instrutor/frequencias',
    icon: 'UserCheck',
    privilege: 'view_matriculation',
  },
  {
    label: 'Pagamentos dos Alunos',
    href: '/instrutor/pagamentos',
    icon: 'DollarSign',
    privilege: 'view_matriculation',
  },
  {
    label: 'Horários das Disciplinas',
    href: '/instrutor/horarios',
    icon: 'Clock',
    privilege: 'view_instructor_discipline',
  },

  // Compartilhados
  {
    label: 'Instrutores',
    href: '/instrutores',
    icon: 'Users',
    privilege: 'list_users',
  },
  {
    label: 'Horários de Treino',
    href: '/horarios',
    icon: 'Clock',
    privilege: 'view_discipline',
  },
];

export async function getSidebarItems(cookies: string): Promise<SidebarItem[]> {
  try {
    // const response = await fetch('http://localhost:3000/auth/me', {
    //   method: 'GET',
    //   credentials: 'include',

    // });

    // Make the API request with cookies
    const response = await api.get<User>('/auth/me', {
      headers: {
        Cookie: cookies,
      },
      // Disable throwing on HTTP errors to handle 401 gracefully
      throwOnHttpError: false,
    });
    // const response = await authService.me();

    if (!response.ok) {
      // If the response is not ok (e.g., 401 Unauthorized), return empty array
      console.error('Failed to fetch user data:', response.status);
      return [];
    }

    const user = response.data;

    // Filter items based on user privileges
    const visibleItems = sidebarItems.filter((item) => {
      if (!item.privilege && !item.privileges) return true;
      if (item.privilege)
        return user.privileges.some(
          (p: { name: string }) => p.name === item.privilege
        );
      if (item.privileges) {
        return item.requireAll
          ? item.privileges.every((p) =>
              user.privileges.some((priv: { name: string }) => priv.name === p)
            )
          : item.privileges.some((p) =>
              user.privileges.some((priv: { name: string }) => priv.name === p)
            );
      }
      return false;
    });

    console.log({ visibleItems: visibleItems[0] });

    return visibleItems;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return [];
  }
}
