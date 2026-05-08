"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) return setError(authError.message);

    const { data: profile } = await supabase.from("users").select("role").eq("id", data.user.id).single();
    router.push(profile?.role === "admin" ? "/admin/dashboard" : "/member/dashboard");
    router.refresh();
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 p-4">
      <form className="w-full max-w-sm rounded-xl bg-slate-900 p-6" onSubmit={onSubmit}>
        <h1 className="mb-4 text-2xl font-semibold">TaskNova Login</h1>
        <input
          className="mb-3 w-full rounded-md bg-slate-800 p-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="mb-3 w-full rounded-md bg-slate-800 p-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="mb-3 text-sm text-rose-400">{error}</p>}
        <button className="w-full rounded-md bg-indigo-600 py-2">Sign in</button>
        <p className="mt-3 text-center text-sm text-slate-300">
          No account?{" "}
          <Link href="/signup" className="text-indigo-400 hover:text-indigo-300">
            Create one
          </Link>
        </p>
      </form>
    </main>
  );
}
