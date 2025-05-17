"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Breadcrumb } from "@/components/dashboard/breadcrumb"
import { Sidebar } from "@/components/dashboard/sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Handle responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024)
      // Auto-collapse sidebar on medium screens but not mobile
      if (window.innerWidth < 1280 && window.innerWidth >= 1024) {
        setIsCollapsed(true)
      } else if (window.innerWidth >= 1280) {
        // Expand sidebar on larger screens by default
        setIsCollapsed(false)
      }
    }

    // Initial check
    checkScreenSize()

    // Add event listener for resize
    window.addEventListener("resize", checkScreenSize)

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed left-4 top-3 z-30 bg-primary text-white hover:bg-primary/90"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 bg-primary text-white border-r-0 w-[280px] max-w-full">
          <Sidebar isCollapsed={false} onToggle={() => {}} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          isMobile ? "w-full" : isCollapsed ? "lg:ml-[20px]" : "lg:ml-[30px]",
        )}
      >
        <div className="p-4 md:p-6">
          <Breadcrumb />
          <div className="mt-4">{children}</div>
        </div>
      </main>
    </div>
  )
}
