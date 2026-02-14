"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";

export function useRetryAnalytics(rangeDays = 7) {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [byQueue, setByQueue] = useState<any[]>([]);

  const load = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      // During build/prerender or missing env, don't crash.
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // 1) summary metrics
      const summaryRes = await supabase.rpc("orchestrator_retry_summary", {
        days: rangeDays,
      });

      // 2) timeline (per day counts)
      const since = new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000).toISOString();
      const { data: timelineData, error: timelineErr } = await supabase
        .from("orchestrator_retry_log")
        .select("created_at, status")
        .gte("created_at", since)
        .order("created_at", { ascending: true });

      if (timelineErr) throw timelineErr;

      // 3) group by queue
      const byQueueRes = await supabase.rpc("orchestrator_retry_by_queue", {
        days: rangeDays,
      });

      setSummary(summaryRes?.data ?? summaryRes ?? {});
      setTimeline(timelineData ?? []);
      setByQueue(byQueueRes?.data ?? []);
    } catch (err) {
      console.error("analytics load:", err);
    } finally {
      setLoading(false);
    }
  }, [rangeDays]);

  useEffect(() => {
    load();
  }, [load]);

  return { loading, summary, timeline, byQueue, reload: load };
}
