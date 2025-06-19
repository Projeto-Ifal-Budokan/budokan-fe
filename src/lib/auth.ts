// lib/auth.ts - Funções para verificar privilégios no servidor
import { User } from '@/types/user';
import { redirect } from 'next/navigation';
import { authService } from './api/services/auth-service';

// Função para buscar privilégios do usuário no servidor
export async function getUserPrivileges(): Promise<User | null> {
  try {
    const response = await authService.me();

    if (!response.ok) return null;

    return response.data;
  } catch (error) {
    console.error('Erro ao buscar privilégios:', error);
    return null;
  }
}

// Função para verificar se usuário tem privilégio específico
export async function hasPrivilege(privilege: string): Promise<boolean> {
  const user = await getUserPrivileges();
  return user?.privileges?.some((p) => p.name === privilege) ?? false;
}

// Função para verificar múltiplos privilégios
export async function hasAnyPrivilege(privileges: string[]): Promise<boolean> {
  const user = await getUserPrivileges();
  if (!user?.privileges) return false;
  return privileges.some((privilege) =>
    user.privileges.some((p) => p.name === privilege)
  );
}

// Função para verificar se tem todos os privilégios
export async function hasAllPrivileges(privileges: string[]): Promise<boolean> {
  const user = await getUserPrivileges();
  if (!user?.privileges) return false;
  return privileges.every((privilege) =>
    user.privileges.some((p) => p.name === privilege)
  );
}

// Função para redirecionar se não tiver privilégio
export async function requirePrivilege(privilege: string) {
  const hasAccess = await hasPrivilege(privilege);
  if (!hasAccess) {
    redirect('/acesso-negado');
  }
}

// Função para redirecionar se não tiver nenhum dos privilégios
export async function requireAnyPrivilege(privileges: string[]) {
  const hasAccess = await hasAnyPrivilege(privileges);
  if (!hasAccess) {
    redirect('/acesso-negado');
  }
}
