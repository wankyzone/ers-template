import { SupabaseClient } from '@supabase/supabase-js';

export async function handleDLQ(supabase: SupabaseClient, queueName: string, jobId: string, reason: any) {
  // fetch job details via bullmq (if you prefer, store job payload in job_logs on enqueue to read here)
  // we will insert a record to orchestrator_dlq for admin inspection
  try {
    const payload = { jobId, queueName, reason: typeof reason === 'string' ? reason : JSON.stringify(reason) };
    await supabase
      .from('orchestrator_dlq')
      .insert([{ job_id: jobId, queue_name: queueName, reason: payload.reason, payload: payload, created_at: new Date().toISOString() }]);
  } catch (err) {
    console.warn('DLQ write failed', err);
  }
}
