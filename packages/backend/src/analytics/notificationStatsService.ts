import { supabase } from "@/lib/supabaseClient";

export async function fetchNotificationStats() {
  const { data, error } = await supabase
    .from("notification_stats_view")
    .select("*")
    .order("day", { ascending: false });
    
  if (error) throw error;
  return data;
}
