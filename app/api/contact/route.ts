import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations/contact";
import { getSupabaseServer } from "@/lib/supabase";
import { getResendClient } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = contactFormSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const data = result.data;

    // Store in Supabase if configured
    const supabase = getSupabaseServer();
    if (supabase) {
      const { error: dbError } = await supabase
        .from("contact_messages")
        .insert({
          name: data.name,
          email: data.email,
          subject: data.subject,
          type: data.type,
          message: data.message,
        });

      if (dbError) {
        console.error("[contact] Supabase insert error:", dbError);
      }
    }

    // Send notification email if Resend is configured
    const resend = getResendClient();
    if (resend) {
      const fromEmail =
        process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

      const { error: emailError } = await resend.emails.send({
        from: fromEmail,
        to: "autantfelix@gmail.com",
        subject: `[Portfolio Contact] ${data.subject}`,
        text: [
          `New contact message from your portfolio:`,
          ``,
          `Name: ${data.name}`,
          `Email: ${data.email}`,
          `Type: ${data.type}`,
          `Subject: ${data.subject}`,
          ``,
          `Message:`,
          data.message,
        ].join("\n"),
      });

      if (emailError) {
        console.error("[contact] Resend email error:", emailError);
      }
    }

    // Fallback: log to console if no services are configured
    if (!supabase && !resend) {
      console.log("[contact] Fallback mode - message received:", {
        name: data.name,
        email: data.email,
        subject: data.subject,
        type: data.type,
        message: data.message,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[contact] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
