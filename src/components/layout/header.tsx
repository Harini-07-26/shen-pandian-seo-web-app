"use client";

import React from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Bell, Moon, Sun, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200/50 bg-white/80 px-6 backdrop-blur-xl dark:border-gray-800/50 dark:bg-gray-950/80">
      {/* ─── Search Bar ─── */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search clients, leads, campaigns..."
          className="pl-10 bg-gray-50/50 border-gray-200/80 dark:bg-gray-800/50 dark:border-gray-700/80"
        />
      </div>

      {/* ─── Right side actions ─── */}
      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="relative flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          aria-label="Toggle theme"
        >
          <Sun className="h-[18px] w-[18px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[18px] w-[18px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300">
          <Bell className="h-[18px] w-[18px]" />
          {/* Red dot for unread */}
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-950" />
        </button>

        {/* Separator */}
        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

        {/* User avatar */}
        <div className="flex items-center gap-3 cursor-pointer rounded-xl px-2 py-1.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">SA</AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Super Admin
            </span>
            <span className="text-[11px] text-gray-400">
              admin@agency.com
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
