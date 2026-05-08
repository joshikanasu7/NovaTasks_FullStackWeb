"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { UserRole } from "@/types/domain";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("member");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const supabase = createClient();
    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role
        }
      }
    });

    if (signupError) {
      setError(signupError.message);
      setIsLoading(false);
      return;
    }

    if (!data.user) {
      setError("Signup failed. Please try again.");
      setIsLoading(false);
      return;
    }

    const { data: profile } = await supabase.from("users").select("role").eq("id", data.user.id).single();
    router.push(profile?.role === "admin" ? "/admin/dashboard" : "/member/dashboard");
    router.refresh();
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 p-4">
      <form className="w-full max-w-sm rounded-xl bg-slate-900 p-6" onSubmit={onSubmit}>
        <h1 className="mb-4 text-2xl font-semibold">TaskNova Sign up</h1>
        <input
          className="mb-3 w-full rounded-md bg-slate-800 p-2"
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          className="mb-3 w-full rounded-md bg-slate-800 p-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="mb-3 w-full rounded-md bg-slate-800 p-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
        <select
          className="mb-3 w-full rounded-md bg-slate-800 p-2"
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        {error && <p className="mb-3 text-sm text-rose-400">{error}</p>}
        <button className="w-full rounded-md bg-indigo-600 py-2 disabled:opacity-60" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Sign up"}
        </button>
        <p className="mt-3 text-center text-sm text-slate-300">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}
