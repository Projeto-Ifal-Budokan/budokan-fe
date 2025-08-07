import { AdminRankingsView } from '@/components/dashboard/rankings/admin-rankings-view';
import StudentRankingsView from '@/components/dashboard/rankings/student-rankings-view';
import { authService } from '@/lib/api/services/auth-service';
import { privilegesService } from '@/lib/api/services/privileges-service';
import { hasAccess } from '@/utils/access-control';

export default async function RankingsPage() {
  const { data: user } = await authService.me();
  const { data: userPrivileges } = await privilegesService.getPrivilegesByUser(
    user.id.toString()
  );

  if (user && hasAccess('admin', userPrivileges.items)) {
    return <AdminRankingsView />;
  }

  if (user && hasAccess('instructor', userPrivileges.items)) {
    return <AdminRankingsView />;
  }

  return <StudentRankingsView />;
}
