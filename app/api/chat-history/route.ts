import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

type ChatRole = "user" | "assistant";
type ChatMode = "chat" | "tutor";

type IncomingMessage = {
  id?: string;
  role?: ChatRole;
  text?: string;
  imageThumb?: string;
  image?: string;
  streaming?: boolean;
  pizarra?: string | null;
  boardImageB64?: string | null;
  boardImagePlacement?: unknown;
  revealMs?: number;
};

type IncomingThread = {
  id?: string;
  title?: string;
  updatedAt?: number;
  mode?: ChatMode;
  tutorProfile?: unknown;
  messages?: IncomingMessage[];
};

function getSupabaseEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    throw new Error("Faltan variables de Supabase para chat-history.");
  }

  return { supabaseUrl, anonKey, serviceRoleKey };
}

function getBearerToken(req: NextRequest) {
  const header = req.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

async function getUserFromRequest(req: NextRequest) {
  const token = getBearerToken(req);

  if (!token) {
    return {
      user: null,
      error: "No autorizado.",
    };
  }

  const { supabaseUrl, anonKey } = getSupabaseEnv();

  const authClient = createClient(supabaseUrl, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data, error } = await authClient.auth.getUser(token);

  if (error || !data?.user?.id) {
    return {
      user: null,
      error: "Sesión no válida.",
    };
  }

  return {
    user: data.user,
    error: null,
  };
}

function getServiceClient() {
  const { supabaseUrl, serviceRoleKey } = getSupabaseEnv();

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function supabaseErrorPayload(label: string, error: any) {
  console.error(`[chat-history] ${label}`, {
    message: error?.message,
    code: error?.code,
    details: error?.details,
    hint: error?.hint,
  });

  return {
    ok: false,
    where: label,
    error: error?.message || "Error de Supabase.",
    code: error?.code || null,
    details: error?.details || null,
    hint: error?.hint || null,
  };
}

function safeClientUpdatedAt(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    const d = new Date(value);

    if (!Number.isNaN(d.getTime())) {
      return d.toISOString();
    }
  }

  return new Date().toISOString();
}

function sanitizeTutorProfile(value: unknown) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value;
  }

  return { level: "adult" };
}

function sanitizeMessage(message: IncomingMessage) {
  const role: ChatRole =
    message?.role === "user" || message?.role === "assistant"
      ? message.role
      : "assistant";

  const clean: Record<string, unknown> = {
    id: typeof message?.id === "string" && message.id.trim()
      ? message.id.trim()
      : randomUUID(),
    role,
    text: typeof message?.text === "string" ? message.text : "",
    streaming: false,
    pizarra: typeof message?.pizarra === "string" ? message.pizarra : null,
    boardImageB64: null,
    boardImagePlacement: null,
  };

  if (typeof message?.revealMs === "number" && Number.isFinite(message.revealMs)) {
    clean.revealMs = message.revealMs;
  }

  // Guardamos solo miniaturas ligeras, nunca la imagen completa.
  if (
    typeof message?.imageThumb === "string" &&
    message.imageThumb.startsWith("data:image") &&
    message.imageThumb.length <= 220_000
  ) {
    clean.imageThumb = message.imageThumb;
  }

  return clean;
}

function sanitizeThread(rawThread: IncomingThread) {
  const threadId =
    typeof rawThread?.id === "string" && rawThread.id.trim()
      ? rawThread.id.trim()
      : randomUUID();

  const title =
    typeof rawThread?.title === "string" && rawThread.title.trim()
      ? rawThread.title.trim().slice(0, 120)
      : "Consulta";

  const mode: ChatMode = rawThread?.mode === "tutor" ? "tutor" : "chat";

  const messages = Array.isArray(rawThread?.messages)
    ? rawThread.messages
        .slice(-80)
        .map(sanitizeMessage)
        .filter((message: any) => {
          const hasRole = message.role === "user" || message.role === "assistant";
          const hasText =
            typeof message.text === "string" && message.text.trim().length > 0;
          const hasThumb =
            typeof message.imageThumb === "string" && message.imageThumb.length > 0;

          return hasRole && (hasText || hasThumb);
        })
    : [];

  return {
    threadId,
    title,
    mode,
    tutorProfile: sanitizeTutorProfile(rawThread?.tutorProfile),
    messages,
    clientUpdatedAt: safeClientUpdatedAt(rawThread?.updatedAt),
  };
}

export async function GET(req: NextRequest) {
  try {
    const { user, error: authError } = await getUserFromRequest(req);

    if (!user) {
      return NextResponse.json(
        { ok: false, error: authError || "No autorizado." },
        { status: 401 }
      );
    }

    const serviceClient = getServiceClient();

    const { data, error } = await serviceClient
      .from("chat_threads")
      .select(
        "thread_id,title,mode,tutor_profile,messages,client_updated_at,updated_at"
      )
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .order("client_updated_at", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    const threads = (data || []).map((row: any) => ({
      id: row.thread_id,
      title: row.title || "Consulta",
      mode: row.mode === "tutor" ? "tutor" : "chat",
      tutorProfile: row.tutor_profile || { level: "adult" },
      messages: Array.isArray(row.messages) ? row.messages : [],
      updatedAt: row.client_updated_at
        ? new Date(row.client_updated_at).getTime()
        : Date.now(),
    }));

    return NextResponse.json({
      ok: true,
      threads,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Error leyendo historial.",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user, error: authError } = await getUserFromRequest(req);

    if (!user) {
      return NextResponse.json(
        { ok: false, error: authError || "No autorizado." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);
    const rawThread = body?.thread as IncomingThread | undefined;

    if (!rawThread) {
      return NextResponse.json(
        { ok: false, error: "Falta thread." },
        { status: 400 }
      );
    }

    const thread = sanitizeThread(rawThread);

    if (!thread.messages.length) {
      return NextResponse.json(
        { ok: false, error: "No se guarda una conversación vacía." },
        { status: 400 }
      );
    }

    const serviceClient = getServiceClient();

    const { data: existing, error: existingError } = await serviceClient
      .from("chat_threads")
      .select("id")
      .eq("user_id", user.id)
      .eq("thread_id", thread.threadId)
      .maybeSingle();

    if (existingError) {
  return NextResponse.json(
    supabaseErrorPayload("existing-check", existingError),
    { status: 500 }
  );
}

    if (existing?.id) {
      const { error: updateError } = await serviceClient
        .from("chat_threads")
        .update({
          title: thread.title,
          mode: thread.mode,
          tutor_profile: thread.tutorProfile,
          messages: thread.messages,
          client_updated_at: thread.clientUpdatedAt,
          deleted_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .eq("thread_id", thread.threadId);

      if (updateError) {
  return NextResponse.json(
    supabaseErrorPayload("update-thread", updateError),
    { status: 500 }
  );
}
    } else {
      const { error: insertError } = await serviceClient
        .from("chat_threads")
        .insert({
          id: randomUUID(),
          user_id: user.id,
          thread_id: thread.threadId,
          title: thread.title,
          mode: thread.mode,
          tutor_profile: thread.tutorProfile,
          messages: thread.messages,
          client_updated_at: thread.clientUpdatedAt,
          deleted_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (insertError) {
  // Carrera normal: dos guardados del mismo hilo pueden llegar casi a la vez.
  // Si otra petición ya lo creó, recuperamos haciendo update.
  if (insertError.code === "23505") {
    const { error: duplicateUpdateError } = await serviceClient
      .from("chat_threads")
      .update({
        title: thread.title,
        mode: thread.mode,
        tutor_profile: thread.tutorProfile,
        messages: thread.messages,
        client_updated_at: thread.clientUpdatedAt,
        deleted_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("thread_id", thread.threadId);

    if (duplicateUpdateError) {
      return NextResponse.json(
        supabaseErrorPayload("duplicate-update-thread", duplicateUpdateError),
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      threadId: thread.threadId,
      recoveredFromDuplicate: true,
    });
  }

  return NextResponse.json(
    supabaseErrorPayload("insert-thread", insertError),
    { status: 500 }
  );
}
    }

    return NextResponse.json({
      ok: true,
      threadId: thread.threadId,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Error guardando historial.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { user, error: authError } = await getUserFromRequest(req);

    if (!user) {
      return NextResponse.json(
        { ok: false, error: authError || "No autorizado." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);
    const threadId = typeof body?.threadId === "string" ? body.threadId.trim() : "";

    if (!threadId) {
      return NextResponse.json(
        { ok: false, error: "Falta threadId." },
        { status: 400 }
      );
    }

    const serviceClient = getServiceClient();

    const { error } = await serviceClient
      .from("chat_threads")
      .update({
        deleted_at: new Date().toISOString(),
        archived_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("thread_id", threadId);

    if (error) {
  return NextResponse.json(
    supabaseErrorPayload("delete-thread", error),
    { status: 500 }
  );
}

    return NextResponse.json({
      ok: true,
      threadId,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Error borrando historial.",
      },
      { status: 500 }
    );
  }
}