import { DisciplineDetailView } from '@/components/dashboard/disciplines/discipline-detail-view';
import { authService } from '@/lib/api/services/auth-service';
import { privilegesService } from '@/lib/api/services/privileges-service';

interface DisciplinePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DisciplinePage({ params }: DisciplinePageProps) {
  const { id } = await params;

  const { data: user } = await authService.me();
  const { data: userPrivileges } = await privilegesService.getPrivilegesByUser(
    String(user?.id)
  );

  //   if (!user || !hasAccess('', userPrivileges.items || [])) {
  //     notFound();
  //   }

  return <DisciplineDetailView disciplineId={id} />;
}
