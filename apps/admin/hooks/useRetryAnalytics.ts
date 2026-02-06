import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // adjust path to your admin supabase client

export function useRetryAnalytics(rangeDays = 7) {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [byQueue, setByQueue] = useState<any[]>([]);

  async function load() {
    setLoading(true);
    try {
      // 1) summary metrics
      const summaryRes = await supabase.rpc('orchestrator_retry_summary', { days: rangeDays });
      // fallback to manual SQL if RPC not present:
      // const { data: summaryRes } = await supabase.from('orchestrator_retry_summary_view').select('*').maybeSingle();

      // 2) timeline (per day counts)
      const { data: timelineData } = await supabase
        .from('orchestrator_retry_log')
        .select('created_at, status')
        .gte('created_at', new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true });

      // 3) group by queue
      const { data: byQueueData } = await supabase.rpc('orchestrator_retry_by_queue', { days: rangeDays });

      setSummary(summaryRes?.data ?? summaryRes ?? {});
      setTimeline(timelineData ?? []);
      setByQueue(byQueueData ?? []);
    } catch (err) {
      console.error('analytics load:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [rangeDays]);

  return { loading, summary, timeline, byQueue, reload: load };
}
