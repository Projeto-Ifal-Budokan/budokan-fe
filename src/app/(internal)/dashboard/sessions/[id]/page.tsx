import { SessionAttendanceDetailView } from '@/components/dashboard/sessions/session-detail-view';

interface SessionDetailPageProps {
  params: {
    id: string;
  };
}

export default function SessionDetailPage({ params }: SessionDetailPageProps) {
  return (
    <div className='space-y-6'>
      <SessionAttendanceDetailView sessionId={params.id} />
    </div>
  );
}
