import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
)

serve(async () => {
  const { data, error } = await supabase.from("errands_stats").select("*")
  return new Response(JSON.stringify({ data, error }), {
    headers: { "Content-Type": "application/json" },
  })
})
