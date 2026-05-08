🚀 TaskNova — Role-Based Dashboard System
<div align="center">





Production-ready Next.js + Supabase starter for Admin & Member dashboards with secure Role-Based Access Control (RBAC).
</div>

✨ Features
🔐 Authentication & Security


Supabase Authentication


Role-Based Access Control (RBAC)


Secure middleware route protection


Protected layouts for admin/member routes


Supabase Row Level Security (RLS)


Member-only task update policies


Session-based authentication


Secure API architecture



🧩 Role-Based Dashboards
👑 Admin Panel
Accessible only for admin users.
Routes


/admin/dashboard


/admin/users


/admin/projects


/admin/tasks


/admin/analytics


/admin/settings


Admin Capabilities


Manage users


Create & manage projects


Assign tasks


Monitor analytics


Configure application settings


Full dashboard access



👤 Member Panel
Accessible only for member users.
Routes


/member/dashboard


/member/tasks


/member/projects


/member/notifications


/member/profile


Member Capabilities


View assigned tasks


Update task progress


Track projects


Manage profile


Receive notifications



⚡ Tech Stack
TechnologyUsageNext.jsFrontend FrameworkTypeScriptType SafetySupabaseBackend & DatabaseTailwind CSSUI StylingPostgreSQLDatabaseMiddlewareRoute ProtectionRLS PoliciesDatabase Security

📁 Project Structure
TaskNova/│├── app/│   ├── admin/│   ├── member/│   ├── auth/│   └── api/│├── components/├── lib/├── middleware.ts├── supabase/│   └── schema.sql│├── public/├── styles/└── utils/

🚀 Getting Started
1️⃣ Clone Repository
git clone <your-repository-url>cd tasknova

🔑 Environment Setup
2️⃣ Create Environment File
Copy:
.env.example
to:
.env.local
Fill in your Supabase credentials:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_urlNEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

📦 Install Dependencies
3️⃣ Install Packages
npm install

🗄️ Database Setup
4️⃣ Run SQL Schema
Open Supabase Dashboard → SQL Editor
Run:
supabase/schema.sql
This will automatically create:


tables


RLS policies


triggers


role permissions


profile automation



▶️ Start Development Server
5️⃣ Run Project
npm run dev
Application runs on:
http://localhost:3000

⚡ Simplest Run (Recommended)
Use one command:
npm run dev:easy
This command automatically:


Creates .env.local if missing


Starts Next.js development server


Runs app instantly



🔓 Supabase Auth Setup
To allow users to login immediately after signup:
Disable Email Confirmation


Open Supabase Dashboard


Go to:


Authentication → Providers → Email


Turn OFF:


Confirm email


Save Changes


✅ Users can now sign up & login instantly.

👥 Role Management
Manual Role Insert (Optional)
Use these SQL queries to manually assign roles to existing users.

👑 Create Admin
insert into public.users (id, email, full_name, role)values (  'AUTH_USER_UUID',  'admin@example.com',  'Admin User',  'admin')on conflict (id)do update set role = excluded.role;

👤 Create Member
insert into public.users (id, email, full_name, role)values (  'AUTH_USER_UUID',  'member@example.com',  'Member User',  'member')on conflict (id)do update set role = excluded.role;

🔒 Security Architecture
Middleware Protection


Prevents unauthorized route access


Redirects invalid users automatically


Layout Guards


Server-side role validation


Protects dashboard rendering


Supabase RLS Policies


Database-level access security


Prevents unauthorized data access


Member Ownership Policies
Members can:


View only assigned tasks


Update only their own tasks



📊 Dashboard Modules
Admin Modules


User Management


Project Management


Task Control


Analytics Dashboard


Application Settings


Member Modules


Task Board


Assigned Projects


Notifications


User Profile



🎨 UI Features


Modern dashboard UI


Fully responsive design


Mobile-friendly layouts


Fast loading experience


Clean architecture


Reusable components



🧠 Future Improvements


Team collaboration


Real-time notifications


File uploads


Activity logs


Calendar integration


Dark mode


AI-powered task suggestions



🛠️ Development Notes
Recommended Versions
ToolVersionNode.js18+npmLatestNext.js15+

📄 License
This project is licensed under the MIT License.

❤️ Built With Passion
Developed using:


Next.js


Supabase


TypeScript


Tailwind CSS



<div align="center">
⭐ TaskNova
Secure • Modern • Production Ready
</div>
