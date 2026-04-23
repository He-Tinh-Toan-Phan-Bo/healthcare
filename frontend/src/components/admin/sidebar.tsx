"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    ChevronLeft,
    ChevronRight,
    ShieldCheck
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/shared/utils"
import { useAuthStore } from "@/store"
import { NAV_SECTIONS, ADMIN_ROLES } from "@/shared/constants/admin-nav"

export function AdminSidebar() {
    const pathname = usePathname()
    const { user } = useAuthStore()
    const [collapsed, setCollapsed] = useState(false)

    const filteredSections = NAV_SECTIONS.map(section => {
        const canSeeSection = section.roles.includes(user?.role as string)
        
        if (!canSeeSection) return null

        const filteredItems = section.items.filter(item => {
            // Nếu item có quy định roles riêng, thì check role đó
            if (item.roles) {
                return item.roles.includes(user?.role as string)
            }
            return true
        })

        if (filteredItems.length === 0) return null

        return {
            ...section,
            items: filteredItems
        }
    }).filter(Boolean) as typeof NAV_SECTIONS

    return (
        <aside
            className={cn(
                "relative flex flex-col border-r border-gray-200 bg-white transition-all duration-500 ease-in-out z-40 shadow-[4px_0_24px_rgba(0,0,0,0.02)]",
                collapsed ? "w-[80px]" : "w-[280px]"
            )}
        >
            {/* Logo Section */}
            <div className="flex h-20 items-center px-6 mb-4">
                <div className={cn(
                    "flex items-center gap-3 transition-all duration-300",
                    collapsed && "mx-auto"
                )}>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 text-white shadow-lg shadow-primary/20">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    {!collapsed && (
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-900 leading-none text-lg">Healthcare</span>
                            <span className="text-[10px] uppercase font-bold text-primary tracking-widest mt-1">Admin Panel</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 space-y-8 overflow-y-auto px-4 custom-scrollbar">
                {filteredSections.map((section) => (
                    <div key={section.label} className="space-y-2">
                        {!collapsed && (
                            <h2 className="px-4 text-[11px] font-extrabold uppercase tracking-[0.2em] text-gray-400/80">
                                {section.label}
                            </h2>
                        )}
                        <div className="space-y-1.5">
                            {section.items.map((item) => {
                                const Icon = item.icon
                                const isActive = pathname === item.path

                                return (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        className={cn(
                                            "group relative flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-300 active:scale-[0.97]",
                                            isActive
                                                ? "bg-primary text-white shadow-md shadow-primary/20"
                                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                                            collapsed && "justify-center px-0"
                                        )}
                                        title={collapsed ? item.label : undefined}
                                    >
                                        <Icon className={cn(
                                            "h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110",
                                            isActive ? "text-white" : "text-gray-400 group-hover:text-primary"
                                        )} />
                                        
                                        {!collapsed && (
                                            <span className="text-[14px] font-medium tracking-tight">
                                                {item.label}
                                            </span>
                                        )}

                                        {/* Active Indicator cho bản thu gọn */}
                                        {collapsed && isActive && (
                                            <div className="absolute left-0 h-6 w-1 rounded-r-full bg-primary" />
                                        )}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Collapse Toggle Button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-10 flex h-7 w-7 items-center justify-center rounded-full border border-gray-100 bg-white shadow-md hover:bg-primary hover:text-white transition-all duration-300"
            >
                {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>

            {/* User Profile Section */}
            <div className="p-4 mt-auto">
                <div className={cn(
                    "flex items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-gray-50",
                    collapsed && "justify-center"
                )}>
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-tr from-blue-100 to-indigo-100 text-blue-600 flex items-center justify-center font-bold shadow-sm">
                        {user?.name?.charAt(0) || "A"}
                    </div>
                    {!collapsed && (
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-gray-900">{user?.name || "Admin"}</p>
                            <p className="truncate text-[11px] text-gray-400 font-medium">{user?.email}</p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    )
}
