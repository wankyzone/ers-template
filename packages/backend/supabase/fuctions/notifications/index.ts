import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

serve(async (req) => {
  const payload = await req.json()
  console.log("🔔 Notification received:", payload)
  return new Response("Notification logged successfully")
})
