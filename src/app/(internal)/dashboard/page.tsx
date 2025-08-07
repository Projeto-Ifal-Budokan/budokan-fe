import { AccessPending } from '@/components/dashboard/access-pending';
import { EnhancedDashboard } from '@/components/dashboard/enhanced-dashboard';
import { StudentDashboard } from '@/components/dashboard/student-dashboard';
import { authService } from '@/lib/api/services/auth-service';
import { privilegesService } from '@/lib/api/services/privileges-service';
import { hasAccess } from '@/utils/access-control';

export default async function DashboardPage() {
  const { data: user } = await authService.me();
  const { data: userPrivileges } = await privilegesService.getPrivilegesByUser(
    String(user?.id)
  );

  console.log(userPrivileges.items.map((p) => p.name));

  if (user && hasAccess('admin', userPrivileges.items || [])) {
    return <EnhancedDashboard />;
  }

  if (user && hasAccess('instructor', userPrivileges.items || [])) {
    return <EnhancedDashboard />;
  }

  if (user && hasAccess('student', userPrivileges.items || [])) {
    return <StudentDashboard userId={user.id} />;
  }

  // User exists but doesn't have admin, instructor, or student privileges
  return <AccessPending />;
}
