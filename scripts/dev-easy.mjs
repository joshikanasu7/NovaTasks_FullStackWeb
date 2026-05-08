import { existsSync, copyFileSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const envLocal = path.join(root, ".env.local");
const envExample = path.join(root, ".env.example");

if (!existsSync(envLocal)) {
  if (!existsSync(envExample)) {
    console.error("Missing .env.local and .env.example.");
    console.error("Create .env.local with Supabase keys, then run again.");
    process.exit(1);
  }

  copyFileSync(envExample, envLocal);
  console.log("Created .env.local from .env.example");
}

const child = spawn("npm", ["run", "dev"], {
  stdio: "inherit",
  shell: true,
  cwd: root
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});

