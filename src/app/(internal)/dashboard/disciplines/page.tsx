import DisciplinesManagement from '@/components/dashboard/disciplines/disciplines-management';
import InstructorDisciplinesView from '@/components/dashboard/disciplines/instructor-disciplines-view';
import StudentDisciplinesView from '@/components/dashboard/disciplines/student-disciplines-view';
import { authService } from '@/lib/api/services/auth-service';
import { privilegesService } from '@/lib/api/services/privileges-service';
import { hasAccess } from '@/utils/access-control';

export default async function DisciplinePage() {
  const { data: user } = await authService.me();
  const { data: userPrivileges } = await privilegesService.getPrivilegesByUser(
    String(user?.id)
  );

  if (user && hasAccess('admin', userPrivileges.items || [])) {
    return <DisciplinesManagement />;
  }

  if (user && hasAccess('instructor', userPrivileges.items || [])) {
    return <InstructorDisciplinesView />;
  }

  return <StudentDisciplinesView />;
}
