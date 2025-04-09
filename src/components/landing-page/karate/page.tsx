import Image from "next/image"
import Link from "next/link"
import { ChevronRight, ArrowLeft, Clock, Award, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import DownloadableMaterials from "@/components/downloadable-materials"

export default function KaratePage() {

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header - Reused from landing page */}
      <header className="sticky top-0 z-50 w-full shadow-lg py-2 bg-blue-900 text-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/budokan.jpg-agJBqgCaSEzyDWGHfvAUrKFDnFWaS2.jpeg"
              alt="Budokan Logo"
              width={50}
              height={50}
              className="rounded-full"
            />
            <span className="text-xl font-bold text-white">BUDOKAN</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#about" className="text-sm font-medium text-white hover:text-orange-300 transition-colors">
              Sobre Nós
            </Link>
            <Link
              href="#disciplines"
              className="text-sm font-medium text-white hover:text-orange-300 transition-colors"
            >
              Modalidades
            </Link>
            <Link
              href="#instructors"
              className="text-sm font-medium text-white hover:text-orange-300 transition-colors"
            >
              Senseis
            </Link>
            <Link href="#schedule" className="text-sm font-medium text-white hover:text-orange-300 transition-colors">
              Horários
            </Link>
            <Link href="#contact" className="text-sm font-medium text-white hover:text-orange-300 transition-colors">
              Contato
            </Link>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white border-0">Área do Aluno</Button>
          </nav>
          <Button variant="outline" size="icon" className="md:hidden text-white border-white hover:bg-blue-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </header>

      <main className="flex-1">
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/budokan.jpg-agJBqgCaSEzyDWGHfvAUrKFDnFWaS2.jpeg"
                  alt="Budokan Logo"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <span className="text-xl font-bold">BUDOKAN</span>
              </div>
              <p className="text-sm opacity-70 mb-4">
                Associação de Artes Marciais Budokan, dedicada ao ensino e preservação de artes marciais tradicionais
                japonesas desde 1985.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Modalidades</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/karate"
                    className="text-sm opacity-70 hover:opacity-100 hover:text-yellow-500 transition-colors"
                  >
                    Karate-Do
                  </Link>
                </li>
                <li>
                  <Link
                    href="/kendo"
                    className="text-sm opacity-70 hover:opacity-100 hover:text-yellow-500 transition-colors"
                  >
                    Kendo
                  </Link>
                </li>
                <li>
                  <Link
                    href="/kyudo"
                    className="text-sm opacity-70 hover:opacity-100 hover:text-yellow-500 transition-colors"
                  >
                    Tiro com Arco (Kyudo)
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Links Rápidos</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/#about"
                    className="text-sm opacity-70 hover:opacity-100 hover:text-yellow-500 transition-colors"
                  >
                    Sobre Nós
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#instructors"
                    className="text-sm opacity-70 hover:opacity-100 hover:text-yellow-500 transition-colors"
                  >
                    Senseis
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#schedule"
                    className="text-sm opacity-70 hover:opacity-100 hover:text-yellow-500 transition-colors"
                  >
                    Horários
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#contact"
                    className="text-sm opacity-70 hover:opacity-100 hover:text-yellow-500 transition-colors"
                  >
                    Contato
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Contato</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-yellow-500"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className="text-sm opacity-70">Rua das Artes Marciais, 123 - São Paulo, SP</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-yellow-500"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span className="text-sm opacity-70">(11) 99999-9999</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-yellow-500"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span className="text-sm opacity-70">contato@budokan.com.br</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-sm opacity-70">
              &copy; {new Date().getFullYear()} Associação de Artes Marciais Budokan. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

