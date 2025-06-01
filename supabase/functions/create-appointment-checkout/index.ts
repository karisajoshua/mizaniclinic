
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-APPOINTMENT-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { appointmentDate, appointmentTime, patientNotes } = await req.json();
    if (!appointmentDate || !appointmentTime) {
      throw new Error("Appointment date and time are required");
    }

    logStep("Appointment details received", { appointmentDate, appointmentTime });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      logStep("Creating new customer");
    }

    // Create appointment record first
    const { data: appointment, error: appointmentError } = await supabaseClient
      .from("appointments")
      .insert({
        user_id: user.id,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        patient_notes: patientNotes || null,
        status: 'pending',
        payment_status: 'pending'
      })
      .select()
      .single();

    if (appointmentError) {
      logStep("Error creating appointment", { error: appointmentError });
      throw new Error(`Failed to create appointment: ${appointmentError.message}`);
    }

    logStep("Appointment created", { appointmentId: appointment.id });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Dr. Mwaka Consultation",
              description: `Appointment on ${appointmentDate} at ${appointmentTime}`,
            },
            unit_amount: 5000, // $50 in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        appointment_id: appointment.id,
        user_id: user.id,
      },
      success_url: `${req.headers.get("origin")}/dashboard?appointment_success=true`,
      cancel_url: `${req.headers.get("origin")}/dashboard?appointment_cancelled=true`,
    });

    // Update appointment with Stripe session ID
    await supabaseClient
      .from("appointments")
      .update({ stripe_session_id: session.id })
      .eq("id", appointment.id);

    logStep("Stripe session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url, appointmentId: appointment.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
