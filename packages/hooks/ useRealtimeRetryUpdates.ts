import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useRealtimeRetryUpdates(onChange: () => void) {
  useEffect(() => {
    const channel = supabase
      .channel('retry-analytics')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orchestrator_retry_log' }, payload => {
        onChange(payload);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orchestrator_dlq' }, payload => {
        onChange(payload);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [onChange]);
}
