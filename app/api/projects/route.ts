import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();

  let query = supabase
    .from("projects")
    .select("id,name,description,due_date,owner_id,users!projects_owner_id_fkey(full_name,email)")
    .order("created_at", { ascending: false });

  if (profile?.role === "member") {
    const taskResult = await supabase.from("tasks").select("project_id").eq("assignee_id", user.id);
    const projectIds = [...new Set((taskResult.data ?? []).map((task) => task.project_id))];
    if (projectIds.length === 0) return NextResponse.json({ projects: [] });
    query = query.in("id", projectIds);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ projects: data ?? [] });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const name = (body.name ?? "").trim();
  const description = (body.description ?? "").trim() || null;
  const dueDate = (body.due_date ?? "").trim() || null;

  if (!name) {
    return NextResponse.json({ error: "Project name is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      name,
      description,
      due_date: dueDate,
      owner_id: user.id
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ id: data?.id }, { status: 201 });
}
