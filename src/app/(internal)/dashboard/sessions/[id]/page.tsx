import { SessionAttendanceDetailView } from '@/components/dashboard/sessions/session-detail-view';

interface SessionDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SessionDetailPage({
  params,
}: SessionDetailPageProps) {
  const { id } = await params;

  return (
    <div className='space-y-6'>
      <SessionAttendanceDetailView sessionId={id} />
    </div>
  );
}
