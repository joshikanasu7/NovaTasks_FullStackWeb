import { DashboardShell, type NavItem } from "@/components/dashboard-shell";
import { requireRole } from "@/lib/auth";

const nav: NavItem[] = [
  { href: "/member/dashboard", label: "My Dashboard" },
  { href: "/member/tasks", label: "My Tasks" },
  { href: "/member/projects", label: "My Projects" },
  { href: "/member/notifications", label: "Notifications" },
  { href: "/member/profile", label: "Profile Settings" }
];

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["member"]);
  return <DashboardShell title="TaskNova Member" items={nav}>{children}</DashboardShell>;
}
