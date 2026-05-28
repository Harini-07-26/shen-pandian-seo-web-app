"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  MoreVertical,
  Mail,
  Phone,
  Globe,
} from "lucide-react";

type ClientItem = {
  id: string;
  companyName: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  paymentStatus: "PAID" | "PENDING" | "OVERDUE";
};

type ClientApiResponse = {
  data: {
    clients: ClientItem[];
    meta: { count: number };
  };
};

const paymentStatusColors: Record<string, "success" | "warning" | "destructive"> = {
  PAID: "success",
  PENDING: "warning",
  OVERDUE: "destructive",
};

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const {
    data: clients = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["clients"],
    queryFn: async (): Promise<ClientItem[]> => {
      const response = await fetch("/api/v1/clients");
      if (!response.ok) {
        throw new Error("Unable to fetch clients");
      }
      const json = (await response.json()) as ClientApiResponse;
      return json.data.clients;
    },
  });

  const filtered = clients.filter(
    (c) =>
      c.companyName.toLowerCase().includes(search.toLowerCase()) ||
      (c.contactName ?? "").toLowerCase().includes(search.toLowerCase())
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
            Clients
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your client portfolio
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      {/* ─── Search ─── */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* ─── Client Cards Grid ─── */}
      {isError && (
        <div className="flex items-center gap-3">
          <Badge variant="warning" className="w-fit">
            Unable to fetch clients.
          </Badge>
          <Button size="sm" variant="outline" onClick={() => void refetch()}>
            Retry
          </Button>
        </div>
      )}
      {isLoading && (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading clients...</p>
      )}
      {!isLoading && !isError && filtered.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No clients found.
        </p>
      )}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((client, i) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Card className="group cursor-pointer hover:scale-[1.01] transition-transform duration-300">
              <CardHeader className="flex flex-row items-start justify-between pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/20">
                    {client.companyName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <CardTitle className="text-base">{client.companyName}</CardTitle>
                    <p className="text-xs text-gray-400">{client.contactName ?? "—"}</p>
                  </div>
                </div>
                <button className="rounded-lg p-1 text-gray-400 opacity-0 transition-opacity hover:bg-gray-100 group-hover:opacity-100 dark:hover:bg-gray-800">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" />
                    <span>{client.email ?? "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{client.phone ?? "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5" />
                    <span>{client.companyName.toLowerCase().replace(/\s+/g, "")}.com</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Badge variant="secondary" className="text-[10px]">
                    Client
                  </Badge>
                  <Badge variant={paymentStatusColors[client.paymentStatus]}>
                    {client.paymentStatus}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
