import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useRealtimeRetryUpdates(onChange: (payload: any) => void) {
  useEffect(() => {
    const channel = supabase
      .channel("retry-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orchestrator_retry_log" },
        (payload) => onChange(payload)
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orchestrator_dlq" },
        (payload) => onChange(payload)
      )
      .subscribe();

    // ✅ cleanup MUST be sync (no async/await)
    return () => {
      supabase.removeChannel(channel);
    };
  }, [onChange]);
}

