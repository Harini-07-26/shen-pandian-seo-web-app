"use client";

import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type DashboardSummary = {
  clients: number;
  activeCampaigns: number;
  totalLeads: number;
  conversionRate: number;
};

type DashboardAnalyticsResponse = {
  data: {
    summary: DashboardSummary;
    revenueData: Array<{ month: string; revenue: number; expenses: number }>;
    leadConversionData: Array<{ month: string; converted: number; lost: number }>;
    campaignPerformance: Array<{ name: string; value: number; color: string }>;
    recentActivities: Array<{
      user: string;
      action: string;
      target: string;
      time: string;
      type: "success" | "warning" | "info" | "default";
    }>;
  };
};

// ─── Animation variants ───
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// ─── Mock data ───
const defaultStats = [
  {
    title: "Total Revenue",
    value: "$84,254",
    change: 12.5,
    trend: "up" as const,
    // icon: DollarSign,
    gradient: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/25",
  },
  {
    title: "Active Clients",
    value: "48",
    change: 8.2,
    trend: "up" as const,
    // icon: Users,
    gradient: "from-blue-500 to-indigo-600",
    shadow: "shadow-blue-500/25",
  },
  {
    title: "Running Campaigns",
    value: "24",
    change: -3.1,
    trend: "down" as const,
    // icon: Megaphone,
    gradient: "from-purple-500 to-pink-600",
    shadow: "shadow-purple-500/25",
  },
  {
    title: "New Leads",
    value: "127",
    change: 24.3,
    trend: "up" as const,
    // icon: UserPlus,
    gradient: "from-amber-500 to-orange-600",
    shadow: "shadow-amber-500/25",
  },
];

type StatItem = {
  title: string;
  value: string;
  change: number;
  trend: "up" | "down";
  gradient: string;
  shadow: string;
};

// ─── Stat Card Component ───
export const StatCard = ({
  stat,
  index,
}: {
  stat: StatItem;
  index: number;
}) => {
  return (
    <div className="bg-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <Card className="relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <div className="flex items-center gap-1">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm font-semibold ${stat.trend === "up"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                      }`}
                  >
                    {Math.abs(stat.change)}%
                  </span>
                  <span className="text-xs text-gray-400">vs last month</span>
                </div>
              </div>
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg ${stat.shadow}`}
              >
                {/* <stat.icon className="h-7 w-7 text-white" /> */}
              </div>
            </div>
          </CardContent>
          {/* Decorative gradient stripe */}
          <div
            className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${stat.gradient} opacity-60`}
          />
        </Card>
      </motion.div>
    </div>
  );
}

// ─── Custom Tooltip ───
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ color?: string; name?: string; value?: number }>;
  label?: string;
}) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-xl border border-gray-200/50 bg-white/95 p-3 shadow-xl backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-900/95">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
        {label}
      </p>
      {payload.map((entry, i: number) => (
        <p key={i} className="text-sm font-bold" style={{ color: entry.color }}>
          {entry.name}: ${entry.value?.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

// ─── Dashboard Page ───
export default function DashboardPage() {
  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["dashboard-analytics"],
    queryFn: async () => {
      const response = await fetch("/api/v1/dashboard/analytics");
      if (!response.ok) {
        throw new Error("Unable to fetch dashboard analytics");
      }
      const json = (await response.json()) as DashboardAnalyticsResponse;
      return json.data;
    },
  });

  const summary = data?.summary ?? null;

  const stats: StatItem[] = summary
    ? [
      {
        ...defaultStats[0],
        value: `${summary.conversionRate}%`,
      },
      {
        ...defaultStats[1],
        value: summary.clients.toString(),
      },
      {
        ...defaultStats[2],
        value: summary.activeCampaigns.toString(),
      },
      {
        ...defaultStats[3],
        value: summary.totalLeads.toString(),
      },
    ]
    : defaultStats;

  const revenueData = data?.revenueData ?? [];
  const leadConversionData = data?.leadConversionData ?? [];
  const campaignPerformance = data?.campaignPerformance ?? [];
  const recentActivities = data?.recentActivities ?? [];

  return (
    <motion.div
      className="space-y-6"
      initial="initial"
      animate="animate"
      variants={stagger}
    >
      {/* ─── Page Title ─── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Welcome back! Here&apos;s an overview of your agency&apos;s performance.
          </p>
        </div>
        <Badge variant="default" className="px-3 py-1 text-xs">
          <BarChart3 className="mr-1.5 h-3 w-3" />
          Live
        </Badge>
      </div>

      {/* ─── Stat Cards ─── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.title} stat={stat} index={i} />
        ))}
      </div>
      {isLoading && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading dashboard analytics...
        </p>
      )}
      {isError && (
        <div className="flex items-center gap-3">
          <Badge variant="warning">Unable to fetch dashboard analytics.</Badge>
          <Badge
            variant="secondary"
            className="cursor-pointer hover:opacity-80"
            onClick={() => void refetch()}
          >
            Retry
          </Badge>
        </div>
      )}

      {/* ─── Charts Row ─── */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* Revenue Chart (2 cols) */}
        <motion.div className="xl:col-span-2" variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>
                Monthly revenue vs expenses for the current year
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient
                      id="revenueGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#6366f1"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="100%"
                        stopColor="#6366f1"
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="expenseGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#ec4899"
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="100%"
                        stopColor="#ec4899"
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb40"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                    tickFormatter={(v) => `$${v / 1000}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fill="url(#revenueGrad)"
                    name="Revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ec4899"
                    strokeWidth={2}
                    fill="url(#expenseGrad)"
                    name="Expenses"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Campaign Pie Chart */}
        <motion.div variants={fadeInUp}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Campaign Mix</CardTitle>
              <CardDescription>Budget allocation by service</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={campaignPerformance}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {campaignPerformance.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="mt-2 flex flex-wrap justify-center gap-3">
                {campaignPerformance.map((entry) => (
                  <div
                    key={entry.name}
                    className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400"
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    {entry.name}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ─── Bottom Row ─── */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Lead Conversion Chart */}
        <motion.div variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle>Lead Conversion</CardTitle>
              <CardDescription>
                Converted vs lost leads per month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={leadConversionData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb40"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="converted"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                    name="Converted"
                  />
                  <Bar
                    dataKey="lost"
                    fill="#f43f5e"
                    radius={[6, 6, 0, 0]}
                    name="Lost"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={fadeInUp}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest team actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    {/* Avatar dot */}
                    <div
                      className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${activity.type === "success"
                        ? "bg-emerald-500"
                        : activity.type === "warning"
                          ? "bg-amber-500"
                          : activity.type === "info"
                            ? "bg-blue-500"
                            : "bg-gray-400"
                        }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {activity.user}
                        </span>{" "}
                        {activity.action}{" "}
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          {activity.target}
                        </span>
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
