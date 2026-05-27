"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

/**
 * Dashboard layout – renders the sidebar on the left and the header + content area on the right.
 * All /dashboard/** pages share this layout.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area – offset by sidebar width */}
      <div className="flex flex-1 flex-col pl-[260px] transition-all duration-300">
        <Header />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
