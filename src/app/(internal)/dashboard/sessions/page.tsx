import SessionsManagement from '@/components/dashboard/sessions/sessions-management';
import { StudentSessionsView } from '@/components/dashboard/sessions/student-session-view';
import { authService } from '@/lib/api/services/auth-service';
import { privilegesService } from '@/lib/api/services/privileges-service';
import { hasAccess } from '@/utils/access-control';

export default async function SessionsPage() {
  const { data: user } = await authService.me();
  const { data: userPrivileges } = await privilegesService.getPrivilegesByUser(
    String(user?.id)
  );

  if (user && hasAccess('admin', userPrivileges.items || [])) {
    return <SessionsManagement />;
  }

  if (user && hasAccess('instructor', userPrivileges.items || [])) {
    return <SessionsManagement />;
  }

  return <StudentSessionsView />;
}
