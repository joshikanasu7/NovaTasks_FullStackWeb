"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import type { Route } from "next";
import { createClient } from "@/lib/supabase-client";

export interface NavItem {
  href: Route;
  label: string;
}

export function DashboardShell({
  title,
  items,
  children
}: {
  title: string;
  items: NavItem[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 md:flex">
      <aside className="w-full border-b border-slate-800 p-4 md:w-64 md:border-b-0 md:border-r">
        <h2 className="mb-4 text-xl font-semibold">{title}</h2>
        <nav className="flex gap-2 md:flex-col">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx("rounded-md px-3 py-2 text-sm", {
                "bg-indigo-600 text-white": pathname === item.href,
                "text-slate-300 hover:bg-slate-800": pathname !== item.href
              })}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="mt-4 w-full rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
