import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  const dueDate = request.nextUrl.searchParams.get("dueDate");

  let query = supabase
    .from("tasks")
    .select("id,title,status,due_date,project_id,assignee_id,projects(name)")
    .order("created_at", { ascending: false });

  if (profile?.role === "member") {
    query = query.eq("assignee_id", user.id);
  }

  if (dueDate) {
    query = query.eq("due_date", dueDate);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ tasks: data ?? [] });
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
  const title = (body.title ?? "").trim();
  const description = (body.description ?? "").trim() || null;
  const status = (body.status ?? "").trim() || "To Do";
  const dueDate = (body.due_date ?? "").trim() || null;
  const projectId = (body.project_id ?? "").trim();
  const assigneeId = (body.assignee_id ?? "").trim();

  if (!title || !projectId || !assigneeId) {
    return NextResponse.json({ error: "Title, project, and assignee are required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      title,
      description,
      status,
      due_date: dueDate,
      project_id: projectId,
      assignee_id: assigneeId,
      created_by: user.id
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ id: data?.id }, { status: 201 });
}
