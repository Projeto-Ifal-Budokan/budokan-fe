import { api } from '@/lib/api/client';
import {
  INSTRUCTOR_PRIVILEGES,
  PRIVILEGES,
  STUDENT_PRIVILEGES,
  type PrivilegeType,
} from '@/types/privileges';
import { User } from '@/types/user';

export type ProfileType = 'instructor' | 'student' | 'admin';

const PROFILE_PRIVILEGES: Record<ProfileType, PrivilegeType[]> = {
  instructor: INSTRUCTOR_PRIVILEGES,
  student: STUDENT_PRIVILEGES,
  admin: Object.values(PRIVILEGES), // Admin has all privileges
};

/**
 * Checks if a user has access to a specific profile type
 * @param profileType The type of profile to check access for
 * @param user The user object containing privileges
 * @returns boolean indicating if user has access
 */
export function hasAccess(profileType: ProfileType, user: User): boolean {
  const requiredPrivileges = PROFILE_PRIVILEGES[profileType];
  const userPrivileges = user.privileges.map((p: { name: string }) => p.name);

  return requiredPrivileges.every((privilege) =>
    userPrivileges.includes(privilege)
  );
}

/**
 * Server-side function to check user access
 * @param profileType The type of profile to check access for
 * @param cookies The cookies containing the user session
 * @returns Promise<boolean> indicating if user has access
 */
export async function checkUserAccess(
  profileType: ProfileType,
  cookies: string
): Promise<boolean> {
  try {
    const response = await api.get<User>('/auth/me', {
      headers: {
        Cookie: cookies,
      },
      throwOnHttpError: false,
    });

    if (!response.ok) {
      console.error('Failed to fetch user data:', response.status);
      return false;
    }

    const user = response.data;
    return hasAccess(profileType, user);
  } catch (error) {
    console.error('Error checking user access:', error);
    return false;
  }
}
