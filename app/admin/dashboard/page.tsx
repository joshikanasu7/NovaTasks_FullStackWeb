import { StatCard } from "@/components/stat-card";
import { createClient } from "@/lib/supabase-server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const [{ count: userCount }, { count: projectCount }, { data: tasks }, { count: memberCount }] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("tasks").select("id,status,due_date"),
    supabase.from("users").select("*", { count: "exact", head: true }).eq("role", "member")
  ]);

  const totalTasks = tasks?.length ?? 0;
  const completedTasks = (tasks ?? []).filter((task) => task.status.toLowerCase() === "done").length;
  const openTasks = totalTasks - completedTasks;
  const overdueTasks = (tasks ?? []).filter((task) => !!task.due_date && task.due_date < today).length;
  const projectCompletionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    ["Total Users", userCount ?? 0],
    ["Total Projects", projectCount ?? 0],
    ["Total Tasks", totalTasks],
    ["Completed Tasks", completedTasks],
    ["Open Tasks", openTasks],
    ["Overdue Tasks", overdueTasks],
    ["Project Completion Rate", `${projectCompletionRate}%`],
    ["Active Members", memberCount ?? 0]
  ] as const;

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Overview</h1>
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map(([label, value]) => (
          <StatCard key={label} label={label} value={value} />
        ))}
      </div>
    </section>
  );
}
