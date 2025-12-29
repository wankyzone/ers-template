import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import Paystack from "https://esm.sh/paystack-api@2.0.0"

const paystack = Paystack(Deno.env.get("PAYSTACK_SECRET_KEY")!)
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
)

serve(async (req) => {
  const { method } = req
  const body = await req.json()

  if (method === "POST") {
    // Initialize payment
    const response = await paystack.transaction.initialize({
      email: body.email,
      amount: body.amount * 100,
      callback_url: body.callback_url,
    })
    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    })
  }

  if (method === "POST" && req.url.endsWith("/verify")) {
    const { reference } = body
    const response = await paystack.transaction.verify(reference)
    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    })
  }

  return new Response("Invalid request", { status: 400 })
})
