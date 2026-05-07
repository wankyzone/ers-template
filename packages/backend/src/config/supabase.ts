import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";

type RealtimeTransport = {
  new (address: string | URL, subprotocols?: string | string[]): any;
  [key: string]: any;
};

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.SUPABASE_ANON_KEY ??
  process.env.SUPABASE_KEY;

const supabaseKeyName = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? "SUPABASE_SERVICE_ROLE_KEY"
  : process.env.SUPABASE_ANON_KEY
    ? "SUPABASE_ANON_KEY"
    : process.env.SUPABASE_KEY
      ? "SUPABASE_KEY"
      : undefined;

if (!supabaseUrl) {
  throw new Error("Missing SUPABASE_URL environment variable");
}

if (!supabaseKey || !supabaseKeyName) {
  throw new Error(
    "Missing Supabase key. Set SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY, or SUPABASE_KEY.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  realtime: {
    transport: WebSocket as unknown as RealtimeTransport,
  },
});

console.log(`[supabase] initialized using ${supabaseKeyName}`);
