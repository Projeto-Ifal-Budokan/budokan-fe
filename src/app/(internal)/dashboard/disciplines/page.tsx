import { AdminDisciplinesView } from '@/components/dashboard/disciplines/admin-disciplines-view';
import { authService } from '@/lib/api/services/auth-service';
import { hasAccess } from '@/utils/access-control';

export default async function DisciplinePage() {
  const { data: user } = await authService.me();

  if (user && hasAccess('admin', user)) {
    return <AdminDisciplinesView />;
  }

  return null;
}
