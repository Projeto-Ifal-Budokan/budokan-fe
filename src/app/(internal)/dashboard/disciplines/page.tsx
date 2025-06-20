import { AdminDisciplinesView } from '@/components/dashboard/disciplines/admin-disciplines-view';
import { authService } from '@/lib/api/services/auth-service';
import { privilegesService } from '@/lib/api/services/privileges-service';
import { hasAccess } from '@/utils/access-control';

export default async function DisciplinePage() {
  const { data: user } = await authService.me();
  const { data: userPrivileges } = await privilegesService.getPrivilegesByUser(
    user.id.toString()
  );

  if (user && hasAccess('admin', userPrivileges)) {
    return <AdminDisciplinesView />;
  }

  return null;
}
