// ers-client/packages/backend/scripts/seed.js
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

await supabase.from("users").insert([
  { email: "test@example.com", password: "hashed_pw" },
]);
console.log("✅ Seeded test data");
