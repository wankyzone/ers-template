export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="p-6 rounded-xl bg-white shadow-sm">Earnings</div>
      <div className="p-6 rounded-xl bg-white shadow-sm">Active Runners</div>
      <div className="p-6 rounded-xl bg-white shadow-sm">Pending Errands</div>
    </div>
  );
}
