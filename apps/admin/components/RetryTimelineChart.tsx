import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function RetryTimelineChart({ data }: { data: any[] }) {
  // expected data: [{ created_at: '2025-11-12T...', retry_count: 5, failed: 1, success: 4 }]
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data}>
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="retry_count" stroke="#1DB954" dot={false} />
        <Line type="monotone" dataKey="failed" stroke="#ef4444" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
