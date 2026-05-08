"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  LineChart,
  Line
} from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];

export function TaskStatusPie() {
  const data = [
    { name: "Completed", value: 42 },
    { name: "In Progress", value: 28 },
    { name: "Pending", value: 21 },
    { name: "Overdue", value: 9 }
  ];
  return (
    <div className="h-72 rounded-xl border border-slate-800 bg-slate-900 p-3">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" outerRadius={90}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MonthlyProgress() {
  const data = [
    { month: "Jan", progress: 20 },
    { month: "Feb", progress: 35 },
    { month: "Mar", progress: 49 },
    { month: "Apr", progress: 66 },
    { month: "May", progress: 78 }
  ];
  return (
    <div className="h-72 rounded-xl border border-slate-800 bg-slate-900 p-3">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="month" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Line type="monotone" dataKey="progress" stroke="#22c55e" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TeamPerformance() {
  const data = [
    { name: "Ali", score: 78 },
    { name: "Asha", score: 92 },
    { name: "Jin", score: 84 },
    { name: "Ravi", score: 88 }
  ];
  return (
    <div className="h-72 rounded-xl border border-slate-800 bg-slate-900 p-3">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Bar dataKey="score" fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
