import { createClient } from "@/lib/supabase-server";
import { AdminUserRoleTable, type AdminUserRow } from "@/components/admin-user-role-table";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return null;

  const { data: users } = await supabase
    .from("users")
    .select("id,full_name,email,role")
    .order("created_at", { ascending: false });

  const rows: AdminUserRow[] = (users ?? []).map((u: any) => ({
    id: u.id,
    name: u.full_name,
    email: u.email,
    role: u.role
  }));

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">User Management</h1>
      <AdminUserRoleTable users={rows} />
    </section>
  );
}
