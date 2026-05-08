import { StatCard } from "@/components/stat-card";
import { createClient } from "@/lib/supabase-server";

export default async function MemberDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return null;

  const today = new Date().toISOString().slice(0, 10);
  const { data: myTasks } = await supabase.from("tasks").select("id,status,due_date").eq("assignee_id", user.id);

  const total = myTasks?.length ?? 0;
  const done = (myTasks ?? []).filter((task) => task.status.toLowerCase() === "done").length;
  const todo = (myTasks ?? []).filter((task) => task.status.toLowerCase() !== "done").length;
  const overdue = (myTasks ?? []).filter((task) => !!task.due_date && task.due_date < today).length;
  const todayCount = (myTasks ?? []).filter((task) => task.due_date === today).length;

  const stats = [
    ["My Tasks", total],
    ["Completed Tasks", done],
    ["Open Tasks", todo],
    ["Overdue Tasks", overdue],
    ["Today's Tasks", todayCount]
  ] as const;

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">My Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-5">
        {stats.map(([label, value]) => (
          <StatCard key={label} label={label} value={value} />
        ))}
      </div>
    </section>
  );
}
