"use client";

import { useState } from "react";

export type AdminUserRow = {
  id: string;
  name: string | null;
  email: string;
  role: "admin" | "member";
};

export function AdminUserRoleTable({ users }: { users: AdminUserRow[] }) {
  const [rows, setRows] = useState<AdminUserRow[]>(users);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateRole = async (userId: string, nextRole: AdminUserRow["role"]) => {
    setError(null);
    setSavingId(userId);
    const res = await fetch(`/api/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: nextRole })
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(payload.error ?? "Failed to update role");
      setSavingId(null);
      return;
    }

    setRows((prev) => prev.map((u) => (u.id === userId ? { ...u, role: nextRole } : u)));
    setSavingId(null);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div className="mb-3 text-sm text-slate-300">Admins can change member/admin access for task visibility.</div>
      {error && <p className="mb-3 text-sm text-rose-400">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="px-3 py-2 font-semibold text-slate-200">User</th>
              <th className="px-3 py-2 font-semibold text-slate-200">Email</th>
              <th className="px-3 py-2 font-semibold text-slate-200">Role</th>
              <th className="px-3 py-2 font-semibold text-slate-200">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id} className="border-b border-slate-800/60">
                <td className="px-3 py-2 text-slate-200">
                  {u.name?.trim() ? u.name : <span className="text-slate-400">{u.email}</span>}
                </td>
                <td className="px-3 py-2 text-slate-300">{u.email}</td>
                <td className="px-3 py-2 text-slate-300">{u.role}</td>
                <td className="px-3 py-2">
                  <select
                    className="rounded-md bg-slate-800 p-2 text-sm"
                    value={u.role}
                    onChange={(e) => updateRole(u.id, e.target.value as AdminUserRow["role"])}
                    disabled={savingId === u.id}
                  >
                    <option value="member">member</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

