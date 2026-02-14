"use client";

import { useEffect } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";

export function useRealtimeRetryUpdates(onChange: (payload: any) => void) {
  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

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

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onChange]);
}
