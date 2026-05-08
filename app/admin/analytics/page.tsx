import { TaskStatusPie, MonthlyProgress, TeamPerformance } from "@/components/charts";

export default function AdminAnalyticsPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <div className="grid gap-4 lg:grid-cols-3">
        <TaskStatusPie />
        <MonthlyProgress />
        <TeamPerformance />
      </div>
    </section>
  );
}
