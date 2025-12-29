import { createClient } from '@supabase/supabase-js';

export async function logJobEvent(supabase: ReturnType<typeof createClient>, jobName: string, status: string, meta: any = {}) {
  try {
    await supabase.from('job_logs').insert([{ job_name: jobName, status, meta, created_at: new Date().toISOString() }]);
  } catch (err) {
    console.warn('Failed to write job log', err);
  }
}
