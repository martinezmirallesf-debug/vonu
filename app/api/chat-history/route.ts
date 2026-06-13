import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type ThreadMode = "chat" | "tutor";
type TutorLevel = "kid" | "teen" | "adult" | "unknown";

type IncomingMessage = {
  id?: string;
  role?: "user" | "assistant";
  text?: string | null;
  imageThumb?: string | null;
  pizarra?: string | null;
  createdAt?: string | number | null;
  sortOrder?: number | null;
};

type IncomingThread = {
  id?: string;
  title?: string | null;
  mode?: ThreadMode | null;
  tutorProfile?: {
    level?: TutorLevel | null;
  } | null;
  messages?: IncomingMessage[];
};

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function getEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return { supabaseUrl, supabaseAnonKey };
}

function getSupabaseForRequest(req: NextRequest) {
  const { supabaseUrl, supabaseAnonKey } = getEnv();

  const authorization = req.headers.get("authorization") || "";

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: authorization
        ? {
            Authorization: authorization,
          }
        : {},
    },
  });
}

async function getUserOr401(req: NextRequest) {
  const supabase = getSupabaseForRequest(req);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      supabase,
      user: null,
      response: json(
        {
          ok: false,
          error: "No autorizado. Inicia sesión para sincronizar el historial.",
        },
        401
      ),
    };
  }

  return { supabase, user, response: null };
}

function cleanTitle(title: unknown) {
  const t = String(title ?? "").trim();

  if (!t) return "Nueva consulta";

  return t.length > 80 ? `${t.slice(0, 80)}…` : t;
}

function cleanMode(mode: unknown): ThreadMode {
  return mode === "tutor" ? "tutor" : "chat";
}

function cleanTutorLevel(level: unknown): TutorLevel {
  if (
    level === "kid" ||
    level === "teen" ||
    level === "adult" ||
    level === "unknown"
  ) {
    return level;
  }

  return "adult";
}

function cleanText(text: unknown) {
  const t = typeof text === "string" ? text : "";

  return t.trim() ? t : null;
}

function cleanImageThumb(imageThumb: unknown) {
  const t = typeof imageThumb === "string" ? imageThumb : "";

  if (!t.trim()) return null;

  // Evitamos guardar miniaturas enormes en Supabase.
  if (t.length > 260_000) return null;

  return t;
}

function normalizeDate(input: unknown) {
  if (!input) return new Date().toISOString();

  try {
    const d = new Date(input as any);

    if (Number.isNaN(d.getTime())) {
      return new Date().toISOString();
    }

    return d.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

export async function GET(req: NextRequest) {
  try {
    const { supabase, user, response } = await getUserOr401(req);

    if (response || !user) return response;

    const { data: threads, error: threadsError } = await supabase
      .from("chat_threads")
      .select("id,title,mode,tutor_level,created_at,updated_at,archived_at")
      .eq("user_id", user.id)
      .is("archived_at", null)
      .order("updated_at", { ascending: false })
      .limit(24);

    if (threadsError) {
      return json(
        {
          ok: false,
          error: threadsError.message,
        },
        500
      );
    }

    const threadIds = (threads ?? []).map((thread: any) => thread.id);

    if (!threadIds.length) {
      return json({
        ok: true,
        threads: [],
      });
    }

    const { data: messages, error: messagesError } = await supabase
      .from("chat_messages")
      .select("id,thread_id,role,text,image_thumb,pizarra,created_at,sort_order")
      .eq("user_id", user.id)
      .in("thread_id", threadIds)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (messagesError) {
      return json(
        {
          ok: false,
          error: messagesError.message,
        },
        500
      );
    }

    const messagesByThread = new Map<string, any[]>();

    for (const message of messages ?? []) {
      const threadId = String((message as any).thread_id);
      const current = messagesByThread.get(threadId) ?? [];

      current.push(message);
      messagesByThread.set(threadId, current);
    }

    const normalizedThreads = (threads ?? []).map((thread: any) => {
      const threadMessages = messagesByThread.get(thread.id) ?? [];

      return {
        id: thread.id,
        title: thread.title || "Nueva consulta",
        updatedAt: new Date(thread.updated_at).getTime(),
        mode: thread.mode === "tutor" ? "tutor" : "chat",
        tutorProfile: {
          level: thread.tutor_level || "adult",
        },
        messages: threadMessages.map((message: any) => ({
          id: message.id,
          role: message.role,
          text: message.text ?? undefined,
          imageThumb: message.image_thumb ?? undefined,
          pizarra: message.pizarra ?? null,
          streaming: false,
        })),
      };
    });

    return json({
      ok: true,
      threads: normalizedThreads,
    });
  } catch (error: any) {
    return json(
      {
        ok: false,
        error: error?.message || "Error cargando historial.",
      },
      500
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { supabase, user, response } = await getUserOr401(req);

    if (response || !user) return response;

    const body = (await req.json().catch(() => ({}))) as {
      thread?: IncomingThread;
    };

    const incomingThread = body?.thread;

    if (!incomingThread) {
      return json(
        {
          ok: false,
          error: "Falta thread.",
        },
        400
      );
    }

    const threadId =
      typeof incomingThread.id === "string" && incomingThread.id.trim()
        ? incomingThread.id.trim()
        : crypto.randomUUID();

    const title = cleanTitle(incomingThread.title);
    const mode = cleanMode(incomingThread.mode);
    const tutorLevel = cleanTutorLevel(incomingThread.tutorProfile?.level);

    const messages = Array.isArray(incomingThread.messages)
      ? incomingThread.messages.slice(-80)
      : [];

    const { error: upsertThreadError } = await supabase
      .from("chat_threads")
      .upsert(
        {
          id: threadId,
          user_id: user.id,
          title,
          mode,
          tutor_level: tutorLevel,
          updated_at: new Date().toISOString(),
          archived_at: null,
        },
        {
          onConflict: "id",
        }
      );

    if (upsertThreadError) {
      return json(
        {
          ok: false,
          error: upsertThreadError.message,
        },
        500
      );
    }

    // Primera versión simple:
    // guardamos el estado completo de la conversación.
    // Borramos mensajes previos de ese hilo y metemos los actuales.
    const { error: deleteMessagesError } = await supabase
      .from("chat_messages")
      .delete()
      .eq("thread_id", threadId)
      .eq("user_id", user.id);

    if (deleteMessagesError) {
      return json(
        {
          ok: false,
          error: deleteMessagesError.message,
        },
        500
      );
    }

    const rows = messages
      .filter(
        (message) =>
          message?.role === "user" || message?.role === "assistant"
      )
      .map((message, index) => ({
        id:
          typeof message.id === "string" && message.id.trim()
            ? message.id.trim()
            : crypto.randomUUID(),

        thread_id: threadId,
        user_id: user.id,

        role: message.role,
        text: cleanText(message.text),
        image_thumb: cleanImageThumb(message.imageThumb),
        pizarra: cleanText(message.pizarra),

        sort_order:
          typeof message.sortOrder === "number" &&
          Number.isFinite(message.sortOrder)
            ? message.sortOrder
            : index,

        created_at: normalizeDate(message.createdAt),
      }));

    if (rows.length) {
      const { error: insertMessagesError } = await supabase
        .from("chat_messages")
        .insert(rows);

      if (insertMessagesError) {
        return json(
          {
            ok: false,
            error: insertMessagesError.message,
          },
          500
        );
      }
    }

    return json({
      ok: true,
      threadId,
    });
  } catch (error: any) {
    return json(
      {
        ok: false,
        error: error?.message || "Error guardando historial.",
      },
      500
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { supabase, user, response } = await getUserOr401(req);

    if (response || !user) return response;

    const url = new URL(req.url);
    const threadId = url.searchParams.get("threadId");

    if (!threadId) {
      return json(
        {
          ok: false,
          error: "Falta threadId.",
        },
        400
      );
    }

    const { error } = await supabase
      .from("chat_threads")
      .delete()
      .eq("id", threadId)
      .eq("user_id", user.id);

    if (error) {
      return json(
        {
          ok: false,
          error: error.message,
        },
        500
      );
    }

    return json({
      ok: true,
    });
  } catch (error: any) {
    return json(
      {
        ok: false,
        error: error?.message || "Error borrando conversación.",
      },
      500
    );
  }
}