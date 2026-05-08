import { createClient } from "@/lib/supabase-server";
import { AdminNewProjectForm } from "@/components/admin-new-project-form";

export default async function AdminProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("id,name,description,due_date,users!projects_owner_id_fkey(full_name,email)")
    .order("created_at", { ascending: false });

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">Project Management</h1>
      <AdminNewProjectForm />
      {projects?.length ? (
        projects.map((project) => {
          const owner = Array.isArray(project.users) ? project.users[0] : project.users;
          return (
            <div key={project.id} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <p className="text-lg font-semibold">{project.name}</p>
              <p className="mt-1 text-sm text-slate-300">{project.description ?? "No description"}</p>
              <p className="mt-1 text-xs text-slate-400">
                Owner: {owner?.full_name ?? owner?.email ?? "N/A"} | Due: {project.due_date ?? "N/A"}
              </p>
            </div>
          );
        })
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p>No projects found.</p>
        </div>
      )}
    </section>
  );
}
