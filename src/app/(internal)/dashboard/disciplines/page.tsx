import { AdminDisciplinesView } from '@/components/dashboard/disciplines/admin-disciplines-view';
import { authService } from '@/lib/api/services/auth-service';
import { privilegesService } from '@/lib/api/services/privileges-service';
import { hasAccess } from '@/utils/access-control';

export default async function DisciplinePage() {
  const { data: user } = await authService.me();
  const { data: userPrivileges } = await privilegesService.getPrivilegesByUser(
    String(user?.id)
  );

  if (user && hasAccess('admin', userPrivileges.items || [])) {
    return <AdminDisciplinesView />;
  }

  return null;
}
