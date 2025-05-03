import Link from "next/link"
import { BookOpen, Calendar, UserCircle, Users, CreditCard, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Dashboard card data
const dashboardCards = [
  {
    title: "Modalidades",
    description: "Gerenciar modalidades e turmas",
    icon: BookOpen,
    href: "/dashboard/modalidades",
    color: "bg-orange-500",
  },
  {
    title: "Frequência",
    description: "Controle de presença dos alunos",
    icon: Calendar,
    href: "/dashboard/frequencia",
    color: "bg-blue-500",
  },
  {
    title: "Instrutores",
    description: "Gerenciar instrutores e professores",
    icon: UserCircle,
    href: "/dashboard/instrutores",
    color: "bg-green-500",
  },
  {
    title: "Usuários",
    description: "Administrar usuários do sistema",
    icon: Users,
    href: "/dashboard/usuarios",
    color: "bg-purple-500",
  },
  {
    title: "Alunos",
    description: "Gerenciar cadastro de alunos",
    icon: Users,
    href: "/dashboard/alunos",
    color: "bg-red-500",
  },
  {
    title: "Pagamentos",
    description: "Controle financeiro e mensalidades",
    icon: CreditCard,
    href: "/dashboard/pagamentos",
    color: "bg-yellow-500",
  },
  {
    title: "Relatórios",
    description: "Visualizar estatísticas e relatórios",
    icon: BarChart3,
    href: "/dashboard/relatorios",
    color: "bg-teal-500",
  },
]

export function DashboardCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {dashboardCards.map((card) => (
        <Link key={card.href} href={card.href} className="block">
          <Card className="h-full transition-all hover:shadow-md hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold">{card.title}</CardTitle>
              <div className={`${card.color} p-2 rounded-md text-white`}>
                <card.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>{card.description}</CardDescription>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
