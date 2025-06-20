import { AdminRankingsView } from '@/components/dashboard/rankings/admin-rankings-view';
import { authService } from '@/lib/api/services/auth-service';
import { hasAccess } from '@/utils/access-control';
import { cookies } from 'next/headers';

export default async function RankingsPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const { data: user } = await authService.me(cookieHeader);

  if (user && hasAccess('admin', user)) {
    return <AdminRankingsView />;
  }

  return null;
}
