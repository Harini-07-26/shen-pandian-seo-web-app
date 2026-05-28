"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, ArrowRight, Calendar } from "lucide-react";

type LeadStatus = "NEW" | "CONTACTED" | "PROPOSAL_SENT" | "CONVERTED" | "LOST";

type LeadItem = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: LeadStatus;
  source: string | null;
  assignedTo: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
  nextFollowUp: string | null;
};

type LeadApiResponse = {
  data: {
    leads: LeadItem[];
    meta: { count: number };
  };
};

const statusColumns = [
  { key: "NEW", label: "New", color: "bg-blue-500" },
  { key: "CONTACTED", label: "Contacted", color: "bg-amber-500" },
  { key: "PROPOSAL_SENT", label: "Proposal Sent", color: "bg-purple-500" },
  { key: "CONVERTED", label: "Converted", color: "bg-emerald-500" },
  { key: "LOST", label: "Lost", color: "bg-red-500" },
];

const statusBadgeVariant: Record<LeadStatus, "default" | "warning" | "success" | "destructive" | "secondary"> = {
  NEW: "default",
  CONTACTED: "warning",
  PROPOSAL_SENT: "secondary",
  CONVERTED: "success",
  LOST: "destructive",
};

export default function LeadsPage() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"pipeline" | "list">("pipeline");
  const {
    data: leads = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["leads"],
    queryFn: async (): Promise<LeadItem[]> => {
      const response = await fetch("/api/v1/leads");
      if (!response.ok) {
        throw new Error("Unable to fetch leads");
      }
      const json = (await response.json()) as LeadApiResponse;
      return json.data.leads;
    },
  });

  const filtered = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      (l.email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Lead Pipeline
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track and manage your sales pipeline
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex rounded-lg border border-gray-200 bg-white p-0.5 dark:border-gray-700 dark:bg-gray-800">
            <button
              onClick={() => setView("pipeline")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                view === "pipeline"
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
              }`}
            >
              Pipeline
            </button>
            <button
              onClick={() => setView("list")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                view === "list"
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
              }`}
            >
              List
            </button>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* ─── Search ─── */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search leads..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* ─── Pipeline View ─── */}
      {isError && (
        <div className="flex items-center gap-3">
          <Badge variant="warning" className="w-fit">
            Unable to fetch leads.
          </Badge>
          <Button size="sm" variant="outline" onClick={() => void refetch()}>
            Retry
          </Button>
        </div>
      )}
      {isLoading && (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading leads...</p>
      )}
      {!isLoading && !isError && filtered.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">No leads found.</p>
      )}
      {view === "pipeline" ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {statusColumns.map((col) => {
            const colLeads = filtered.filter((l) => l.status === col.key);
            return (
              <div
                key={col.key}
                className="flex w-[280px] shrink-0 flex-col rounded-2xl border border-gray-200/60 bg-gray-50/50 p-3 dark:border-gray-800/60 dark:bg-gray-900/30"
              >
                {/* Column header */}
                <div className="mb-3 flex items-center gap-2 px-1">
                  <div className={`h-2.5 w-2.5 rounded-full ${col.color}`} />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {col.label}
                  </span>
                  <Badge variant="secondary" className="ml-auto text-[10px]">
                    {colLeads.length}
                  </Badge>
                </div>
                {/* Lead cards */}
                <div className="space-y-2.5">
                  {colLeads.map((lead, i) => (
                    <motion.div
                      key={lead.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <Card className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-3.5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {lead.name}
                            </span>
                            <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
                          </div>
                          <p className="text-xs text-gray-400">{lead.email ?? "—"}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-gray-400">
                              {lead.source ?? "—"}
                            </span>
                            {lead.nextFollowUp && (
                              <div className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400">
                                <Calendar className="h-3 w-3" />
                                {new Date(lead.nextFollowUp).toLocaleDateString(
                                  "en-US",
                                  { month: "short", day: "numeric" }
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-800">
                            <span className="text-[10px] text-gray-400">
                              Assigned: {lead.assignedTo?.name ?? "Unassigned"}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ─── List View ─── */
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Source</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Assigned To</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Follow Up</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lead) => (
                    <tr key={lead.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{lead.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{lead.email ?? "—"}</td>
                      <td className="px-6 py-4">
                        <Badge variant={statusBadgeVariant[lead.status as LeadStatus]}>
                          {lead.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{lead.source ?? "—"}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {lead.assignedTo?.name ?? "Unassigned"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {lead.nextFollowUp
                          ? new Date(lead.nextFollowUp).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
