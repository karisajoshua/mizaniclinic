import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authHeader = req.headers.get("Authorization") ?? "";
    const caller = createClient(url, anon, { global: { headers: { Authorization: authHeader } } });

    const { data: { user }, error: userErr } = await caller.auth.getUser();
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: "Not signed in" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: isAdmin } = await caller.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (isAdmin !== true) {
      return new Response(JSON.stringify({ error: "Admins only" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { targetUserId, newPassword } = await req.json();
    if (!targetUserId || typeof newPassword !== "string" || newPassword.length < 6) {
      return new Response(JSON.stringify({ error: "A user and a password of at least 6 characters are required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(url, service);
    const { error } = await admin.auth.admin.updateUserById(targetUserId, { password: newPassword });
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
