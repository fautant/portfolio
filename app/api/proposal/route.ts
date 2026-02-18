import { NextResponse } from "next/server";
import { proposalFormSchema } from "@/lib/validations/proposal";
import { getSupabaseServer } from "@/lib/supabase";
import { getResendClient } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = proposalFormSchema.safeParse(body);
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
        .from("project_proposals")
        .insert({
          name: data.name,
          email: data.email,
          company: data.company || null,
          budget: data.budget,
          deadline: data.deadline,
          description: data.description,
        });

      if (dbError) {
        console.error("[proposal] Supabase insert error:", dbError);
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
        subject: `[Portfolio Proposal] New project from ${data.name}`,
        text: [
          `New project proposal from your portfolio:`,
          ``,
          `Name: ${data.name}`,
          `Email: ${data.email}`,
          `Company: ${data.company || "N/A"}`,
          `Budget: ${data.budget}`,
          `Deadline: ${data.deadline}`,
          ``,
          `Description:`,
          data.description,
        ].join("\n"),
      });

      if (emailError) {
        console.error("[proposal] Resend email error:", emailError);
      }
    }

    // Fallback: log to console if no services are configured
    if (!supabase && !resend) {
      console.log("[proposal] Fallback mode - proposal received:", {
        name: data.name,
        email: data.email,
        company: data.company,
        budget: data.budget,
        deadline: data.deadline,
        description: data.description,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[proposal] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
