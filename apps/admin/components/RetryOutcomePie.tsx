import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#10B981", "#F59E0B", "#EF4444"];

export default function RetryOutcomePie({ data }: { data: any[] }) {
  // expect: [{ name: 'success', value: 120 }, { name: 'retrying', value: 30 }, { name: 'failed', value: 10 }]
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80} fill="#8884d8" label>
          {data.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
