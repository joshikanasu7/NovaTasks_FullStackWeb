import { createClient } from "@/lib/supabase-server";

export default async function MemberProjectsPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: taskRows } = await supabase.from("tasks").select("project_id").eq("assignee_id", user.id);
  const projectIds = [...new Set((taskRows ?? []).map((row) => row.project_id))];

  const { data: projects } =
    projectIds.length > 0
      ? await supabase
          .from("projects")
          .select("id,name,description,due_date")
          .in("id", projectIds)
          .order("created_at", { ascending: false })
      : { data: [] as { id: string; name: string; description: string | null; due_date: string | null }[] };

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">My Projects</h1>
      {projects?.length ? (
        projects.map((project) => (
          <div key={project.id} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-lg font-semibold">{project.name}</p>
            <p className="mt-1 text-sm text-slate-300">{project.description ?? "No description"}</p>
            <p className="mt-1 text-xs text-slate-400">Due: {project.due_date ?? "N/A"}</p>
          </div>
        ))
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p>No assigned projects found.</p>
        </div>
      )}
    </section>
  );
}
