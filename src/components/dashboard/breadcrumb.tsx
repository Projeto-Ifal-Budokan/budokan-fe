"use client"

import { Fragment } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"

export function Breadcrumb() {
  const pathname = usePathname()

  // Skip rendering breadcrumbs on the main dashboard page
  if (pathname === "/dashboard") {
    return null
  }

  // Create breadcrumb items from the pathname
  const pathSegments = pathname.split("/").filter(Boolean)

  // Map path segments to readable names
  const pathNames: Record<string, string> = {
    dashboard: "Dashboard",
    disciplines: "Modalidades",
    attendance: "Frequência",
    instructors: "Instrutores",
    users: "Usuários",
    students: "Alunos",
    payments: "Pagamentos",
    reports: "Relatórios",
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm text-gray-600 mb-4">
      <ol className="flex items-center space-x-1">
        <li>
          <Link href="/dashboard" className="flex items-center hover:text-orange-500">
            <Home className="h-4 w-4" />
            <span className="sr-only">Dashboard</span>
          </Link>
        </li>

        {pathSegments.map((segment, index) => {
          // Build the href for this segment
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`
          const isLast = index === pathSegments.length - 1

          return (
            <Fragment key={segment}>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </li>
              <li>
                {isLast ? (
                  <span className="font-medium text-primary">{pathNames[segment] || segment}</span>
                ) : (
                  <Link href={href} className="hover:text-orange-500">
                    {pathNames[segment] || segment}
                  </Link>
                )}
              </li>
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
