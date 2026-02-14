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
        { event: "*", schema: "public", table: "retry_jobs" }, // adjust table/schema if different
        (payload) => onChange(payload)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onChange]);
}
  