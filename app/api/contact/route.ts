import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function cleanText(value: unknown, maxLength = 2000) {
  return String(value ?? "")
    .trim()
    .slice(0, maxLength);
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function sendContactEmail(params: {
  name: string;
  email: string;
  reason: string;
  message: string;
}) {
  const resendApiKey = process.env.RESEND_API_KEY || "";
  const toEmail = process.env.CONTACT_TO_EMAIL || "hello@vonuai.com";
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "contact@vonuai.com";

  if (!resendApiKey) {
    console.warn("CONTACT_EMAIL_SKIPPED", {
      reason: "Missing RESEND_API_KEY",
    });

    return {
      ok: false,
      skipped: true,
    };
  }

  const safeName = escapeHtml(params.name || "Sin nombre");
  const safeEmail = escapeHtml(params.email);
  const safeReason = escapeHtml(params.reason || "Sin motivo");
  const safeMessage = escapeHtml(params.message).replaceAll("\n", "<br />");

  const subject = `Nuevo mensaje de contacto — ${params.reason || "VonuAI"}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; color: #111827;">
      <h1 style="font-size: 24px; line-height: 1.2; margin: 0 0 16px;">
        Nuevo mensaje desde VonuAI
      </h1>

      <p style="font-size: 15px; line-height: 1.6; color: #4b5563; margin: 0 0 24px;">
        Alguien ha enviado el formulario de contacto de la web.
      </p>

      <div style="background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 18px; padding: 18px; margin-bottom: 18px;">
        <p style="margin: 0 0 8px;"><strong>Nombre:</strong> ${safeName}</p>
        <p style="margin: 0 0 8px;"><strong>Email:</strong> ${safeEmail}</p>
        <p style="margin: 0;"><strong>Motivo:</strong> ${safeReason}</p>
      </div>

      <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 18px; padding: 18px;">
        <p style="margin: 0 0 10px;"><strong>Mensaje:</strong></p>
        <p style="font-size: 15px; line-height: 1.7; color: #374151; margin: 0;">
          ${safeMessage}
        </p>
      </div>

      <p style="font-size: 13px; line-height: 1.6; color: #6b7280; margin-top: 22px;">
        Este mensaje también se ha guardado en Supabase en la tabla contact_messages.
      </p>
    </div>
  `;

  const text = [
    "Nuevo mensaje desde VonuAI",
    "",
    `Nombre: ${params.name || "Sin nombre"}`,
    `Email: ${params.email}`,
    `Motivo: ${params.reason || "Sin motivo"}`,
    "",
    "Mensaje:",
    params.message,
    "",
    "Este mensaje también se ha guardado en Supabase en la tabla contact_messages.",
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `VonuAI <${fromEmail}>`,
      to: [toEmail],
      reply_to: params.email,
      subject,
      html,
      text,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    console.error("CONTACT_RESEND_ERROR", {
      status: response.status,
      data,
    });

    return {
      ok: false,
      skipped: false,
      error: data,
    };
  }

  return {
    ok: true,
    data,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    const name = cleanText(body?.name, 120);
    const email = cleanText(body?.email, 180).toLowerCase();
    const reason = cleanText(body?.reason, 120);
    const message = cleanText(body?.message, 5000);

    if (!email || !isValidEmail(email)) {
      return json(
        {
          ok: false,
          error: "Introduce un email válido.",
        },
        400
      );
    }

    if (!message || message.length < 5) {
      return json(
        {
          ok: false,
          error:
            "Escribe un mensaje un poco más detallado para poder ayudarte.",
        },
        400
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("CONTACT_CONFIG_ERROR", {
        hasSupabaseUrl: !!supabaseUrl,
        hasServiceRoleKey: !!serviceRoleKey,
      });

      return json(
        {
          ok: false,
          error: "Error de configuración del formulario de contacto.",
        },
        500
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
      },
    });

    const { error } = await supabase.from("contact_messages").insert({
      name: name || null,
      email,
      reason: reason || null,
      message,
      status: "new",
      source: "contact_page",
    });

    if (error) {
      console.error("CONTACT_SUPABASE_INSERT_ERROR", error);

      return json(
        {
          ok: false,
          error: "No se ha podido guardar el mensaje ahora mismo.",
        },
        500
      );
    }

    const emailResult = await sendContactEmail({
      name,
      email,
      reason,
      message,
    });

    if (!emailResult.ok) {
      console.warn("CONTACT_EMAIL_NOT_SENT", emailResult);
    }

    return json(
      {
        ok: true,
        message: "Mensaje recibido correctamente.",
        emailSent: emailResult.ok,
      },
      200
    );
  } catch (error: any) {
    console.error("CONTACT_INTERNAL_ERROR", error);

    return json(
      {
        ok: false,
        error: "Error interno enviando el mensaje.",
        message: error?.message ?? String(error),
      },
      500
    );
  }
}