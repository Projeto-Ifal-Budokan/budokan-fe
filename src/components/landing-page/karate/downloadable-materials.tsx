import { Button } from '@/components/ui/button';
import { BookOpen, Download, FileText, Video } from 'lucide-react';

export interface DownloadableItem {
  title: string;
  description: string;
  fileType: 'pdf' | 'doc' | 'video';
  fileSize: string;
  downloadUrl: string;
}

interface DownloadableMaterialsProps {
  title: string;
  description: string;
  materials: DownloadableItem[];
}

export default function DownloadableMaterials({
  title,
  description,
  materials,
}: DownloadableMaterialsProps) {
  const getIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className='h-6 w-6 text-red-500' />;
      case 'doc':
        return <BookOpen className='h-6 w-6 text-blue-500' />;
      case 'video':
        return <Video className='h-6 w-6 text-purple-500' />;
      default:
        return <FileText className='h-6 w-6 text-gray-500' />;
    }
  };

  return (
    <section className='bg-white py-16'>
      <div className='container'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-blue-800'>{title}</h2>
          <div className='mx-auto mb-6 h-1 w-20 bg-yellow-500'></div>
          <p className='mx-auto max-w-3xl text-gray-600'>{description}</p>
        </div>

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {materials.map((item, index) => (
            <div
              key={index}
              className='rounded-lg bg-blue-50 p-6 shadow-sm transition-shadow hover:shadow-md'
            >
              <div className='mb-4 flex items-start'>
                <div className='mr-4 rounded-lg bg-white p-3 shadow-sm'>
                  {getIcon(item.fileType)}
                </div>
                <div>
                  <h3 className='mb-1 font-bold text-blue-800'>{item.title}</h3>
                  <p className='text-sm text-gray-500'>
                    {item.fileType.toUpperCase()} • {item.fileSize}
                  </p>
                </div>
              </div>
              <p className='mb-4 text-sm text-gray-600'>{item.description}</p>
              <a href={item.downloadUrl} download>
                <Button className='flex w-full items-center justify-center gap-2 bg-blue-800 hover:bg-blue-900'>
                  <Download className='h-4 w-4' />
                  <span>Download</span>
                </Button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
