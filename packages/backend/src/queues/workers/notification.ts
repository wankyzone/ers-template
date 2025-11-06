import { Worker, Job } from "bullmq";
import { supabase } from "../../lib/supabaseClient";
import { sendPushNotification } from "../../services/notificationService";
import { redisConnection } from "../connection";

export const notificationWorker = new Worker(
  "notificationQueue",
  async (job: Job) => {
    const { type, payload } = job.data;

    try {
      // Send notification via your service
      const result = await sendPushNotification(type, payload);

      // Log to Supabase for analytics and traceability
      await supabase.from("notification_logs").insert({
        job_id: job.id,
        type,
        status: "SUCCESS",
        metadata: result,
        created_at: new Date().toISOString(),
      });

      return result;
    } catch (error: any) {
      // Log error with details
      await supabase.from("notification_logs").insert({
        job_id: job.id,
        type,
        status: "FAILED",
        error_message: error.message || "Unknown error",
        created_at: new Date().toISOString(),
      });

      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 5, // non-blocking, handles multiple jobs in parallel
    limiter: {
      max: 50,
      duration: 1000, // prevent overload
    },
  }
);

// Worker lifecycle event hooks
notificationWorker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed.`);
});

notificationWorker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err.message);
});

notificationWorker.on("progress", (job, progress) => {
  console.log(`📊 Job ${job.id} progress: ${progress}%`);
});
