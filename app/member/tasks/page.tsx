"use client";

import { useEffect, useState } from "react";

type ProjectRef = { name?: string | null };
type Item = {
  id: string;
  title: string;
  status: string;
  due_date: string | null;
  projects?: ProjectRef | ProjectRef[] | null;
};

export default function MemberTasksPage() {
  const [tasks, setTasks] = useState<Item[]>([]);
  const [dueDate, setDueDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async (selectedDate?: string) => {
    setIsLoading(true);
    setError(null);

    const query = selectedDate ? `?dueDate=${encodeURIComponent(selectedDate)}` : "";
    const response = await fetch(`/api/tasks${query}`, { cache: "no-store" });
    const payload = await response.json();

    if (!response.ok) {
      setError(payload.error ?? "Failed to load tasks");
      setIsLoading(false);
      return;
    }

    setTasks(payload.tasks ?? []);
    setIsLoading(false);
  };

  useEffect(() => {
    void loadTasks();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (!response.ok) return;
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, status } : task)));
  };

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">My Tasks</h1>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <label className="mb-2 block text-sm text-slate-300">Filter by due date (calendar)</label>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="rounded-md bg-slate-800 p-2"
          />
          <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm" onClick={() => void loadTasks(dueDate)}>
            Apply
          </button>
          <button
            className="rounded-md border border-slate-700 px-3 py-2 text-sm"
            onClick={() => {
              setDueDate("");
              void loadTasks("");
            }}
          >
            Clear
          </button>
        </div>
      </div>
      {isLoading && <p className="text-slate-300">Loading tasks...</p>}
      {error && <p className="text-rose-400">{error}</p>}
      {!isLoading && !error && tasks.length === 0 && <p className="text-slate-300">No assigned tasks found.</p>}
      {tasks.map((task) => (
        <div key={task.id} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          {(() => {
            const project = Array.isArray(task.projects) ? task.projects[0] : task.projects;
            return (
              <>
                <p className="font-medium">{task.title}</p>
                <p className="mt-1 text-sm text-slate-400">
                  Project: {project?.name ?? "N/A"} | Due: {task.due_date ?? "N/A"}
                </p>
              </>
            );
          })()}
          <select
            className="mt-2 rounded-md bg-slate-800 p-2"
            value={task.status}
            onChange={(e) => updateStatus(task.id, e.target.value)}
          >
            <option value={task.status}>{task.status}</option>
            <option value="To Do">To Do</option>
            <option value="In Work">In Work</option>
            <option value="Done">Done</option>
          </select>
        </div>
      ))}
    </section>
  );
}
