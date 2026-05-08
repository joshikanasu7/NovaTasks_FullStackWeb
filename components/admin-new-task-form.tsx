"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Project = { id: string; name: string };
type User = { id: string; full_name: string | null; email: string };

export function AdminNewTaskForm() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");
  const [dueDate, setDueDate] = useState("");
  const [projectId, setProjectId] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const [projectRes, userRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/users")
      ]);

      if (projectRes.ok) {
        const payload = await projectRes.json();
        setProjects((payload.projects ?? []).map((p: any) => ({ id: p.id, name: p.name })));
      }

      if (userRes.ok) {
        const payload = await userRes.json();
        setUsers(payload.users ?? []);
      }
    };

    void load();
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        status,
        due_date: dueDate || null,
        project_id: projectId,
        assignee_id: assigneeId
      })
    });

    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error ?? "Failed to create task");
      setIsSubmitting(false);
      return;
    }

    setTitle("");
    setDescription("");
    setStatus("To Do");
    setDueDate("");
    setProjectId("");
    setAssigneeId("");
    setIsSubmitting(false);
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="text-lg font-semibold">Create Task</h2>
      <input
        className="w-full rounded-md bg-slate-800 p-2 text-sm"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        className="w-full rounded-md bg-slate-800 p-2 text-sm"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />
      <div className="grid gap-2 md:grid-cols-2">
        <label className="text-sm text-slate-300">
          Project
          <select
            className="mt-1 w-full rounded-md bg-slate-800 p-2 text-sm"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
          >
            <option value="">Select project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-slate-300">
          Assignee
          <select
            className="mt-1 w-full rounded-md bg-slate-800 p-2 text-sm"
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            required
          >
            <option value="">Select user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.full_name || user.email}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <label className="text-sm text-slate-300">
          Status
          <select
            className="mt-1 w-full rounded-md bg-slate-800 p-2 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="To Do">To Do</option>
            <option value="In Work">In Work</option>
            <option value="Done">Done</option>
          </select>
        </label>
        <label className="text-sm text-slate-300">
          Due date
          <input
            type="date"
            className="mt-1 w-full rounded-md bg-slate-800 p-2 text-sm"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </label>
      </div>
      {error && <p className="text-sm text-rose-400">{error}</p>}
      <button
        type="submit"
        className="rounded-md bg-indigo-600 px-3 py-2 text-sm disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating..." : "Create task"}
      </button>
    </form>
  );
}

