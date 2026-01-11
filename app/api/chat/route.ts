// app/api/chat/route.ts
import { NextResponse } from "next/server";

export const runtime = "edge"; // Usamos Edge Runtime para mejor performance

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

type Body = {
  messages?: IncomingMessage[];
  userText?: string;
  imageBase64?: string | null;
};

// Configuración
const SUPABASE_EDGE_FUNCTION_URL = process.env.SUPABASE_EDGE_FUNCTION_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Validar configuración
function validateConfig() {
  const errors = [];
  if (!SUPABASE_EDGE_FUNCTION_URL) errors.push("SUPABASE_EDGE_FUNCTION_URL");
  if (!SUPABASE_ANON_KEY) errors.push("SUPABASE_ANON_KEY");
  
  if (errors.length > 0) {
    throw new Error(`Faltan variables de entorno: ${errors.join(", ")}`);
  }
}

export async function POST(req: Request) {
  try {
    // Validar configuración
    validateConfig();
    
    // Parsear body
    let body: Body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Body inválido. Se espera JSON." },
        { status: 400 }
      );
    }

    // Validar campos mínimos
    const { messages = [], userText = "", imageBase64 = null } = body;
    
    if (!userText && !imageBase64 && messages.length === 0) {
      return NextResponse.json(
        { error: "Se requiere al menos userText o imageBase64" },
        { status: 400 }
      );
    }

    // Preparar payload para Supabase
    const payload = {
      messages: Array.isArray(messages) ? messages : [],
      userText: typeof userText === "string" ? userText : "",
      imageBase64: typeof imageBase64 === "string" ? imageBase64 : null,
    };

    // Llamar al Edge Function de Supabase
    const response = await fetch(SUPABASE_EDGE_FUNCTION_URL!, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        "x-client-info": "nextjs-proxy/v1",
      },
      body: JSON.stringify(payload),
    });

    // Manejar respuesta
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { error: await response.text() };
      }
      
      return NextResponse.json(
        {
          error: `Error del servidor (${response.status})`,
          details: errorData,
        },
        { status: response.status }
      );
    }

    // Devolver respuesta exitosa
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error("Error en proxy API:", error);
    
    // Manejar errores de configuración
    if (error.message?.includes("variables de entorno")) {
      return NextResponse.json(
        {
          error: "Error de configuración",
          message: error.message,
          hint: "Verifica SUPABASE_EDGE_FUNCTION_URL y SUPABASE_ANON_KEY en .env.local",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// Opcional: Manejar OPTIONS para CORS
export async function OPTIONS(req: Request) {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}