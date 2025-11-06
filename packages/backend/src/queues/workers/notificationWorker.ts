import { supabase } from "../../lib/supabaseClient";

await supabase.from("notification_logs").insert({
  job_id: job.id,
  title: job.data.title,
  message: job.data.message,
  recipient: job.data.recipient,
  status: "sent",
  sent_at: new Date().toISOString(),
});
