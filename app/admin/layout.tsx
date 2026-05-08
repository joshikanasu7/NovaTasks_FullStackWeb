import { DashboardShell, type NavItem } from "@/components/dashboard-shell";
import { requireRole } from "@/lib/auth";

const nav: NavItem[] = [
  { href: "/admin/dashboard", label: "Admin Overview" },
  { href: "/admin/users", label: "User Management" },
  { href: "/admin/projects", label: "Project Management" },
  { href: "/admin/tasks", label: "Task Management" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/settings", label: "Settings" }
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["admin"]);
  return <DashboardShell title="TaskNova Admin" items={nav}>{children}</DashboardShell>;
}
