import { api } from '@/lib/api/client';
import { privilegesService } from '@/lib/api/services/privileges-service';
import {
  INSTRUCTOR_PRIVILEGES,
  PRIVILEGES,
  STUDENT_PRIVILEGES,
  type PrivilegeType,
} from '@/types/privileges';
import { Privilege, User } from '@/types/user';

export type ProfileType = 'instructor' | 'student' | 'admin';

const PROFILE_PRIVILEGES: Record<ProfileType, PrivilegeType[]> = {
  instructor: INSTRUCTOR_PRIVILEGES,
  student: STUDENT_PRIVILEGES,
  admin: Object.values(PRIVILEGES), // Admin has all privileges
};

/**
 * Checks if a user has access to a specific profile type
 * @param profileType The type of profile to check access for
 * @param privileges The privileges object containing privileges
 * @returns boolean indicating if user has access
 */
export function hasAccess(
  profileType: ProfileType,
  privileges: Privilege[]
): boolean {
  const requiredPrivileges = PROFILE_PRIVILEGES[profileType];
  const userPrivileges = privileges.map((p) => p.name);

  return requiredPrivileges.every((privilege) =>
    userPrivileges.includes(privilege)
  );
}

/**
 * Server-side function to check user access
 * @param profileType The type of profile to check access for
 * @returns Promise<boolean> indicating if user has access
 */
export async function checkUserAccess(
  profileType: ProfileType
): Promise<boolean> {
  try {
    const response = await api.get<User>('/auth/me');

    if (!response.ok) {
      console.error('Failed to fetch user data:', response.status);
      return false;
    }

    const userPrivilegesResponse = await privilegesService.getPrivilegesByUser(
      response.data.id.toString()
    );

    if (!userPrivilegesResponse.ok) {
      console.error(
        'Failed to fetch user privileges:',
        userPrivilegesResponse.status
      );
      return false;
    }

    const userPrivileges = userPrivilegesResponse.data;
    return hasAccess(profileType, userPrivileges);
  } catch (error) {
    console.error('Error checking user access:', error);
    return false;
  }
}
