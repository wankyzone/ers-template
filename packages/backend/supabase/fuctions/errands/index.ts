import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
)

serve(async (req) => {
  const { method } = req
  const body = method === "POST" ? await req.json() : null

  if (method === "POST") {
    const { data, error } = await supabase.from("errands").insert(body).select("*")
    return new Response(JSON.stringify({ data, error }), {
      headers: { "Content-Type": "application/json" },
    })
  }

  if (method === "GET") {
    const { data, error } = await supabase.from("errands").select("*")
    return new Response(JSON.stringify({ data, error }), {
      headers: { "Content-Type": "application/json" },
    })
  }

  return new Response("Method not allowed", { status: 405 })
})
