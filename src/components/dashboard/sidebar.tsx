"use client"

import type * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut,
  Users,
  UserCircle,
  BookOpen,
  CreditCard,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import icon from "@/app/favicon.ico"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean
  onToggle: () => void
}

// Mock user data - in a real app, this would come from authentication
const user = {
  name: "João Silva",
  role: "Administrador",
  avatar: "/placeholder.svg?height=32&width=32",
}

// Navigation items
const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Modalidades",
    href: "/dashboard/modalidades",
    icon: BookOpen,
  },
  {
    title: "Frequência",
    href: "/dashboard/frequencia",
    icon: Calendar,
  },
  {
    title: "Instrutores",
    href: "/dashboard/instrutores",
    icon: UserCircle,
  },
  {
    title: "Usuários",
    href: "/dashboard/usuarios",
    icon: Users,
  },
  {
    title: "Alunos",
    href: "/dashboard/alunos",
    icon: Users,
  },
  {
    title: "Pagamentos",
    href: "/dashboard/pagamentos",
    icon: CreditCard,
  },
  {
    title: "Relatórios",
    href: "/dashboard/relatorios",
    icon: BarChart3,
  },
]

export function Sidebar({ className, isCollapsed, onToggle, ...props }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className="relative h-full">
      {/* Sidebar */}
      <div
        className={cn(
          "group h-full overflow-hidden border-r bg-blue-900 text-white transition-all duration-300",
          isCollapsed ? "w-[70px]" : "w-[240px]",
          className,
        )}
        {...props}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b px-3">
            <Link href="/" className="flex items-center gap-2">
              <div className={cn("flex items-center", isCollapsed ? "justify-center w-full" : "")}>
                <Image
                  src={icon}
                  alt="Budokan-Ryu Logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                {!isCollapsed && <span className="ml-2 text-lg font-bold text-white">Budokan-Ryu</span>}
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-1">
            <div className="flex flex-col gap-0.5 py-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                    pathname === item.href
                      ? "bg-primary-foreground/10 font-medium text-orange-400"
                      : "text-white hover:bg-primary-foreground/10 hover:text-orange-300",
                    isCollapsed && "justify-center px-2",
                  )}
                >
                  <item.icon className={cn("h-4 w-4", isCollapsed && "h-5 w-5")} />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              ))}
            </div>
          </ScrollArea>

          {/* User section */}
          <div className="border-t p-3">
            <div className={cn("flex items-center gap-2", isCollapsed && "justify-center")}>
              <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="h-7 w-7 rounded-full" />
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-orange-300">{user.name}</span>
                  <span className="text-xs text-white/70">{user.role}</span>
                </div>
              )}
              {!isCollapsed && (
                <Link href="/login" className="ml-auto">
                  <LogOut className="h-4 w-4 text-white/70 hover:text-orange-300" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Collapse button positioned outside the sidebar */}
      <Button
        variant="secondary"
        size="icon"
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border border-border bg-background p-0 shadow-md"
        onClick={onToggle}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3 text-primary" />
        ) : (
          <ChevronLeft className="h-3 w-3 text-primary" />
        )}
      </Button>
    </div>
  )
}
