"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminNewProjectForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, due_date: dueDate || null })
    });

    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error ?? "Failed to create project");
      setIsSubmitting(false);
      return;
    }

    setName("");
    setDescription("");
    setDueDate("");
    setIsSubmitting(false);
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="text-lg font-semibold">Create Project</h2>
      <input
        className="w-full rounded-md bg-slate-800 p-2 text-sm"
        placeholder="Project name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <textarea
        className="w-full rounded-md bg-slate-800 p-2 text-sm"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <label className="text-slate-300">
          Due date:{" "}
          <input
            type="date"
            className="rounded-md bg-slate-800 p-1"
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
        {isSubmitting ? "Creating..." : "Create project"}
      </button>
    </form>
  );
}

