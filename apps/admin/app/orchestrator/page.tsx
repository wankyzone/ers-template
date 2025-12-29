"use client";

import React, { useMemo, useCallback, useState } from "react";
import MetricCard from "@/components/MetricCard";
import RetryTimelineChart from "@/components/RetryTimelineChart";
import RetryOutcomePie from "@/components/RetryOutcomePie";
import { useRetryAnalytics } from "@/hooks/useRetryAnalytics";
import { useRealtimeRetryUpdates } from "@/hooks/useRealtimeRetryUpdates";
import { Button } from "@/components/ui/button";

export default function RetryAnalyticsPage() {
  const [rangeDays, setRangeDays] = useState(7);
  const { loading, summary, timeline, byQueue, reload } = useRetryAnalytics(rangeDays);

  // Realtime updates reload the dataset
  useRealtimeRetryUpdates(() => {
    reload();
  });

  // compute chart data
  const timelineChartData = useMemo(() => {
    // compress timeline into daily buckets or hourly depending on rangeDays
    // naive transform:
    const map = new Map<string, any>();
    (timeline || []).forEach((r: any) => {
      const d = new Date(r.created_at);
      const label = `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
      const existing = map.get(label) ?? { label, retry_count: 0, failed: 0, success: 0 };
      existing.retry_count += 1;
      if (r.status === "failed") existing.failed += 1;
      if (r.status === "success") existing.success += 1;
      map.set(label, existing);
    });
    return Array.from(map.values());
  }, [timeline]);

  const pieData = useMemo(() => {
    const success = summary?.total_success ?? 0;
    const retrying = summary?.total_retrying ?? 0;
    const failed = summary?.total_failed ?? 0;
    return [
      { name: "success", value: success },
      { name: "retrying", value: retrying },
      { name: "failed", value: failed },
    ];
  }, [summary]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Retry Analytics</h1>
        <div className="flex gap-2 items-center">
          <Button onClick={() => setRangeDays(1)}>1d</Button>
          <Button onClick={() => setRangeDays(7)}>7d</Button>
          <Button onClick={() => setRangeDays(30)}>30d</Button>
          <Button variant="ghost" onClick={() => reload()}>Refresh</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <MetricCard title="Retry Success Rate" value={`${Math.round((summary?.success_rate ?? 0) * 100) / 100}%`} />
        <MetricCard title="Avg Retries to Succeed" value={summary?.avg_retries ?? 0} />
        <MetricCard title="DLQ Escape Rate" value={`${Math.round((summary?.dlq_rate ?? 0) * 100) / 100}%`} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 p-4 bg-white rounded-lg shadow-sm">
          <h3 className="mb-2 text-sm font-medium">Retry Timeline</h3>
          <RetryTimelineChart data={timelineChartData} />
        </div>

        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h3 className="mb-2 text-sm font-medium">Outcome Breakdown</h3>
          <RetryOutcomePie data={pieData} />
        </div>
      </div>

      <div className="p-4 bg-white rounded-lg shadow-sm">
        <h3 className="mb-2 text-sm font-medium">Top Queues — Failure Hotspots</h3>
        <div className="grid grid-cols-3 gap-2">
          {(byQueue || []).map((q: any) => (
            <div key={q.queue_name} className="p-2 border rounded">
              <div className="text-sm font-medium">{q.queue_name}</div>
              <div className="text-xs text-muted-foreground">Retries: {q.retry_count}</div>
              <div className="text-xs text-red-500">DLQ: {q.dlq_count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
