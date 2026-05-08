import { createClient } from "@/lib/supabase-server";
import { AdminNewTaskForm } from "@/components/admin-new-task-form";

export default async function AdminTasksPage({
  searchParams
}: {
  searchParams: Promise<{ dueDate?: string }>;
}) {
  const { dueDate } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("tasks")
    .select("id,title,status,due_date,projects(name),users!tasks_assignee_id_fkey(full_name,email)")
    .order("created_at", { ascending: false });

  if (dueDate) {
    query = query.eq("due_date", dueDate);
  }

  const { data: tasks } = await query;

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">Task Management</h1>
      <AdminNewTaskForm />
      <form className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <label className="mb-2 block text-sm text-slate-300">Filter by due date (calendar)</label>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            name="dueDate"
            defaultValue={dueDate ?? ""}
            className="rounded-md bg-slate-800 p-2"
          />
          <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm">
            Apply
          </button>
          <a href="/admin/tasks" className="rounded-md border border-slate-700 px-3 py-2 text-sm">
            Clear
          </a>
        </div>
      </form>
      {tasks?.length ? (
        tasks.map((task) => {
          const project = Array.isArray(task.projects) ? task.projects[0] : task.projects;
          const assignee = Array.isArray(task.users) ? task.users[0] : task.users;
          return (
            <div key={task.id} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <p className="text-lg font-semibold">{task.title}</p>
              <p className="mt-1 text-sm text-slate-300">
                Project: {project?.name ?? "N/A"} | Assignee: {assignee?.full_name ?? assignee?.email ?? "N/A"}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Status: {task.status} | Due: {task.due_date ?? "N/A"}
              </p>
            </div>
          );
        })
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p>No tasks found.</p>
        </div>
      )}
    </section>
  );
}
