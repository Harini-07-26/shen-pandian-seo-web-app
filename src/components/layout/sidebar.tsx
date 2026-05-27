"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Megaphone,
  Search,
  Share2,
  Receipt,
  UsersRound,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Clients", href: "/dashboard/clients", icon: Users },
  { title: "Leads", href: "/dashboard/leads", icon: UserPlus },
  { title: "Campaigns", href: "/dashboard/campaigns", icon: Megaphone },
  { title: "SEO", href: "/dashboard/seo", icon: Search },
  { title: "Social Media", href: "/dashboard/social", icon: Share2 },
  { title: "Billing", href: "/dashboard/billing", icon: Receipt },
  { title: "Team", href: "/dashboard/team", icon: UsersRound },
  { title: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-gray-200/50 bg-white/95 backdrop-blur-xl transition-all duration-300 dark:border-gray-800/50 dark:bg-gray-950/95",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* ─── Logo ─── */}
      <div className="flex h-16 items-center gap-3 border-b border-gray-200/50 px-4 dark:border-gray-800/50">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/25">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              AgencyHub
            </span>
            <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
              Marketing Suite
            </span>
          </div>
        )}
      </div>

      {/* ─── Navigation ─── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                pathname?.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm dark:from-indigo-900/30 dark:to-purple-900/20 dark:text-indigo-300"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-200"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-colors",
                      isActive
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300"
                    )}
                  />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ─── Collapse toggle ─── */}
      <div className="border-t border-gray-200/50 p-3 dark:border-gray-800/50">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>
    </aside>
  );
}

export function SidebarContext() {
  const [collapsed] = useState(false);
  return { collapsed };
}
