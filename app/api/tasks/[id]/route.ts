import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const nextStatus = typeof body.status === "string" ? body.status.trim() : "";
  if (!nextStatus) {
    return NextResponse.json({ error: "Status is required" }, { status: 400 });
  }

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  const taskQuery = supabase.from("tasks").update({ status: nextStatus }).eq("id", id);

  if (profile?.role === "member") {
    await taskQuery.eq("assignee_id", user.id);
  } else {
    await taskQuery;
  }

  return NextResponse.json({ ok: true });
}
