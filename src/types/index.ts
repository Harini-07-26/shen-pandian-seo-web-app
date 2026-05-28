// ──────────────────────────────────────────────────────────
// Shared TypeScript types for the Digital Marketing Agency SaaS
// ──────────────────────────────────────────────────────────

/** User roles */
export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  MARKETING_MANAGER = "MARKETING_MANAGER",
  SEO_EXECUTIVE = "SEO_EXECUTIVE",
  CONTENT_WRITER = "CONTENT_WRITER",
  CLIENT = "CLIENT",
}

/** Lead statuses */
export enum LeadStatus {
  NEW = "NEW",
  CONTACTED = "CONTACTED",
  PROPOSAL_SENT = "PROPOSAL_SENT",
  CONVERTED = "CONVERTED",
  LOST = "LOST",
}

/** Campaign statuses */
export enum CampaignStatus {
  PLANNED = "PLANNED",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  PAUSED = "PAUSED",
  CANCELLED = "CANCELLED",
}

/** Task statuses */
export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

/** Invoice statuses */
export enum InvoiceStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
  CANCELED = "CANCELED",
}

/** Payment statuses */
export enum PaymentStatus {
  PAID = "PAID",
  PENDING = "PENDING",
  OVERDUE = "OVERDUE",
}

/** Service types */
export enum ServiceType {
  SEO = "SEO",
  PPC = "PPC",
  CONTENT = "CONTENT",
  SOCIAL_MEDIA = "SOCIAL_MEDIA",
  EMAIL_MARKETING = "EMAIL_MARKETING",
}

/** Notification types */
export enum NotificationType {
  TASK_REMINDER = "TASK_REMINDER",
  CAMPAIGN_ALERT = "CAMPAIGN_ALERT",
  LEAD_FOLLOWUP = "LEAD_FOLLOWUP",
  GENERAL = "GENERAL",
}

// ──────────────────────────────────────────────────────────
// Data model interfaces
// ──────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  companyName: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  services: ServiceType[];
  paymentStatus: PaymentStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: LeadStatus;
  source: string | null;
  assignedToId: string | null;
  assignedTo?: User;
  clientId: string | null;
  client?: Client;
  notes: string | null;
  nextFollowUp: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string | null;
  status: CampaignStatus;
  startDate: string | null;
  endDate: string | null;
  budget: number | null;
  clientId: string | null;
  client?: Client;
  ownerId: string | null;
  owner?: User;
  tasks?: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  assigneeId: string | null;
  assignee?: User;
  campaignId: string | null;
  campaign?: Campaign;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  client?: Client;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  issuedAt: string;
  dueDate: string | null;
  pdfUrl: string | null;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// ──────────────────────────────────────────────────────────
// Dashboard stat cards
// ──────────────────────────────────────────────────────────

export interface StatCardData {
  title: string;
  value: string | number;
  change: number; // percentage change
  icon: string;
  trend: "up" | "down" | "neutral";
}

export interface ChartDataPoint {
  label: string;
  value: number;
  [key: string]: string | number;
}

// ──────────────────────────────────────────────────────────
// Navigation
// ──────────────────────────────────────────────────────────

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string;
  roles?: Role[];
  children?: NavItem[];
}
