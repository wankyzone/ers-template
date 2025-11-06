import { notificationWorker } from "../queues/workers/notificationWorker";

export const startWorkers = async () => {
  console.log("Starting background workers...");

  try {
    // Start the notification worker
    await notificationWorker.waitUntilReady();
    console.log("Notification worker is live and listening for jobs.");
  } catch (err) {
    console.error("Worker startup failed:", err);
  }
};
