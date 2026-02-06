import { createClient } from '@supabase/supabase-js';
import { enqueueJob } from "./jobs";
import { handleDLQ } from "./dlq";


const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export type AutoRerunConfig = {
  maxRetries: number;
  baseDelayMs: number;
};

export async function handleFailedJob(job: any, config: AutoRerunConfig) {
  job.meta = job.meta ?? {};
  job.meta.retries = job.meta.retries ?? 0;

  const retryNumber = job.meta.retries;
  const { maxRetries, baseDelayMs } = config;

  if (retryNumber < maxRetries) {
    const delay = Math.round(baseDelayMs * Math.pow(3, retryNumber)); // exponential backoff (3^n)
    // log attempt -> status 'retrying'
    await supabase.from('orchestrator_retry_log').insert([{
      job_id: job.id,
      queue_name: job.queue_name,
      retry_number: retryNumber + 1,
      delay_ms: delay,
      status: 'retrying',
      error_message: job.error_message ?? null,
    }]);

    // schedule rerun (enqueue with delay)
    job.meta.retries = retryNumber + 1;
    // Your enqueue function should accept delay ms (adapt to your queue client)
    await enqueueJob(job.queue_name, job, { delayMs: delay });
  } else {
    // final failure -> write failed row and move to DLQ
    await supabase.from('orchestrator_retry_log').insert([{
      job_id: job.id,
      queue_name: job.queue_name,
      retry_number: retryNumber,
      delay_ms: 0,
      status: 'failed',
      error_message: job.error_message ?? 'max retries exceeded',
    }]);

    await handleDLQ(supabase as any, job.queue_name, String(job.id), job.error_message ?? "max retries exceeded");
  }
}

// When job eventually succeeds, have the worker write a success row:
export async function logJobSuccess(job: any) {
  await supabase.from('orchestrator_retry_log').insert([{
    job_id: job.id,
    queue_name: job.queue_name,
    retry_number: job.meta?.retries ?? 0,
    delay_ms: 0,
    status: 'success',
    error_message: null,
  }]);
}
