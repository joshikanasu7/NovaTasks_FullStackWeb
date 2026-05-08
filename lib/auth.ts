import { redirect } from "next/navigation";
import { UserRole } from "@/types/domain";
import { createClient } from "./supabase-server";

export const getCurrentProfile = async () => {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("id,email,full_name,role")
    .eq("id", user.id)
    .single();

  return profile as {
    id: string;
    email: string;
    full_name: string | null;
    role: UserRole;
  } | null;
};

export const requireRole = async (allowed: UserRole[]) => {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (!allowed.includes(profile.role)) {
    redirect(profile.role === "admin" ? "/admin/dashboard" : "/member/dashboard");
  }
  return profile;
};
