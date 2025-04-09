import { FileText, Download, BookOpen, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DownloadableItem {
  title: string
  description: string
  fileType: "pdf" | "doc" | "video"
  fileSize: string
  downloadUrl: string
}

interface DownloadableMaterialsProps {
  title: string
  description: string
  materials: DownloadableItem[]
}

export default function DownloadableMaterials({ title, description, materials }: DownloadableMaterialsProps) {
  const getIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return <FileText className="h-6 w-6 text-red-500" />
      case "doc":
        return <BookOpen className="h-6 w-6 text-blue-500" />
      case "video":
        return <Video className="h-6 w-6 text-purple-500" />
      default:
        return <FileText className="h-6 w-6 text-gray-500" />
    }
  }

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-800 mb-4">{title}</h2>
          <div className="w-20 h-1 bg-yellow-500 mx-auto mb-6"></div>
          <p className="max-w-3xl mx-auto text-gray-600">{description}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((item, index) => (
            <div key={index} className="bg-blue-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start mb-4">
                <div className="bg-white p-3 rounded-lg mr-4 shadow-sm">{getIcon(item.fileType)}</div>
                <div>
                  <h3 className="font-bold text-blue-800 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500">
                    {item.fileType.toUpperCase()} • {item.fileSize}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">{item.description}</p>
              <a href={item.downloadUrl} download>
                <Button className="w-full flex items-center justify-center gap-2 bg-blue-800 hover:bg-blue-900">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </Button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

