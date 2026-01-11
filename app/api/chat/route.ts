// app/api/chat/route.ts - VERSIÓN QUE USA TUS NOMBRES EXACTOS
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    // 1. OBTENER VARIABLES DE TU .env.local
    const supabaseFunctionUrl = process.env.SUPABASE_EDGE_FUNCTION_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;

    console.log("DEBUG - Variables encontradas:");
    console.log("- SUPABASE_EDGE_FUNCTION_URL:", supabaseFunctionUrl ? "✓" : "✗");
    console.log("- NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "✓" : "✗");
    console.log("- OPENAI_API_KEY:", openaiApiKey ? "✓" : "✗");

    // 2. VALIDAR
    if (!supabaseFunctionUrl || !supabaseAnonKey) {
      return NextResponse.json(
        {
          error: "Configuración incompleta",
          message: `Faltan: ${!supabaseFunctionUrl ? 'SUPABASE_EDGE_FUNCTION_URL' : ''} ${!supabaseAnonKey ? 'NEXT_PUBLIC_SUPABASE_ANON_KEY' : ''}`,
          hint: "Verifica tu .env.local"
        },
        { status: 500 }
      );
    }

    // 3. PROCESAR REQUEST
    const body = await req.json();
    const { messages = [], userText = "", imageBase64 = null } = body;

    // 4. LLAMAR A SUPABASE
    const response = await fetch(supabaseFunctionUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${supabaseAnonKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages, userText, imageBase64 }),
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    }

    // 5. FALLBACK A OPENAI
    if (openaiApiKey) {
      console.log("Usando fallback OpenAI...");
      const chatMessages = [
        {
          role: "system",
          content: "Eres Vonu. Español natural. Ayuda con decisiones."
        },
        ...messages.slice(-4),
        { role: "user", content: userText || "Hola" }
      ];

      const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openaiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: chatMessages,
          temperature: 0.4,
        }),
      });

      const data = await openaiResponse.json();
      return NextResponse.json({ 
        text: data.choices?.[0]?.message?.content || "Sin respuesta",
        warning: "Fallback OpenAI"
      });
    }

    // 6. ERROR FINAL
    return NextResponse.json(
      { 
        error: "Todos los servicios fallaron",
        message: "Configura OPENAI_API_KEY para fallback"
      },
      { status: 503 }
    );

  } catch (error: any) {
    console.error("ERROR CRÍTICO:", error);
    return NextResponse.json(
      { 
        error: "Error interno",
        details: error.message 
      },
      { status: 500 }
    );
  }
}