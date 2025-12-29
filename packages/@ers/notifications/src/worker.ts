import { createWorker } from "@ers/dispatch";
import { sendPushNotification } from "./handlers/push";

createWorker("notifications", async (job) => {
  const { name, data } = job;
  if (name === "send_push") {
    await sendPushNotification(data);
  } else {
    console.log(`Unknown job: ${name}`);
  }
});
