"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Receipt,
    Users,
    Settings,
    LogOut,
    Droplets,
    User,
    CreditCard
} from "lucide-react"
import { motion } from "framer-motion"

interface SidebarItemProps {
    href: string
    icon: any
    label: string
    active: boolean
}

const SidebarItem = ({ href, icon: Icon, label, active }: SidebarItemProps) => (
    <Link href={href}>
        <div className={`
            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
            ${active
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"}
        `}>
            <Icon size={20} className={active ? "text-white" : "text-slate-400 group-hover:text-blue-500"} />
            <span className="font-medium">{label}</span>
            {active && (
                <motion.div
                    layoutId="active-pill"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                />
            )}
        </div>
    </Link>
)

interface SidebarProps {
    role: "ADMIN" | "CUSTOMER"
}

export default function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname()

    const adminItems = [
        { href: "/admin/profile", icon: User, label: "Profile" },
        { href: "/admin/bill", icon: Receipt, label: "Bill Management" },
        { href: "/admin/services", icon: Settings, label: "Service Settings" },
        { href: "/admin/customer", icon: Users, label: "Customers" },
    ]

    const customerItems = [
        { href: "/customer/profile", icon: User, label: "My Profile" },
        { href: "/customer/bill", icon: Receipt, label: "My Bills" },
    ]

    const items = role === "ADMIN" ? adminItems : customerItems

    return (
        <aside className="w-72 h-screen sticky top-0 bg-white border-r border-slate-100 p-6 flex flex-col gap-8">
            <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 gradient-blue rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Droplets size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-800 leading-tight">PDAM</h1>
                    <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">Smart Utility</p>
                </div>
            </div>

            <nav className="flex flex-col gap-2 flex-1">
                {items.map((item) => (
                    <SidebarItem
                        key={item.href}
                        {...item}
                        active={pathname.startsWith(item.href)}
                    />
                ))}
            </nav>

            <div className="pt-6 border-t border-slate-50">
                <Link href="/sign-in">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 group">
                        <LogOut size={20} />
                        <span className="font-medium">Sign Out</span>
                    </div>
                </Link>
            </div>
        </aside>
    )
}
