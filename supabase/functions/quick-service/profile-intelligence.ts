export type ProfilePlatform =
  // dating
  | "tinder"
  | "bumble"
  | "badoo"
  | "hinge"
  | "meetic"
  | "match"
  | "okcupid"
  | "pof"
  | "happn"
  | "grindr"
  | "facebook_dating"

  // social
  | "facebook"
  | "instagram"
  | "tiktok"
  | "x"
  | "threads"
  | "snapchat"
  | "bereal"
  | "bluesky"
  | "mastodon"

  // messaging/community
  | "whatsapp"
  | "telegram"
  | "discord"
  | "reddit"

  // professional
  | "linkedin"

  // creator/media
  | "youtube"
  | "twitch"
  | "pinterest"
  | "onlyfans"

  // marketplace / commerce profiles
  | "wallapop"
  | "vinted"
  | "milanuncios"
  | "facebook_marketplace"
  | "airbnb"
  | "booking"

  | "unknown";

export type ProfilePlatformGroup =
  | "dating"
  | "social"
  | "messaging"
  | "professional"
  | "creator"
  | "marketplace"
  | "community"
  | "unknown";

function normalizeProfileText(text: string) {
  return String(text ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

export function detectProfilePlatform(userText: string): ProfilePlatform {
  const t = normalizeProfileText(userText);

  // Dating
  if (t.includes("tinder")) return "tinder";
  if (t.includes("bumble")) return "bumble";
  if (t.includes("badoo")) return "badoo";
  if (t.includes("hinge")) return "hinge";
  if (t.includes("meetic")) return "meetic";
  if (t.includes("match.com") || /\bmatch\b/.test(t)) return "match";
  if (t.includes("okcupid")) return "okcupid";
  if (t.includes("plenty of fish") || /\bpof\b/.test(t)) return "pof";
  if (t.includes("happn")) return "happn";
  if (t.includes("grindr")) return "grindr";
  if (t.includes("facebook dating") || t.includes("parejas de facebook")) {
    return "facebook_dating";
  }

  // Social
  if (t.includes("facebook marketplace")) return "facebook_marketplace";
  if (t.includes("facebook")) return "facebook";
  if (t.includes("instagram") || /\big\b/.test(t)) return "instagram";
  if (t.includes("tiktok") || t.includes("tik tok")) return "tiktok";
  if (t.includes("twitter") || /\bx\b/.test(t) || t.includes("x.com")) return "x";
  if (t.includes("threads")) return "threads";
  if (t.includes("snapchat")) return "snapchat";
  if (t.includes("bereal")) return "bereal";
  if (t.includes("bluesky") || t.includes("bsky")) return "bluesky";
  if (t.includes("mastodon")) return "mastodon";

  // Messaging / community
  if (t.includes("whatsapp") || t.includes("wasap")) return "whatsapp";
  if (t.includes("telegram")) return "telegram";
  if (t.includes("discord")) return "discord";
  if (t.includes("reddit")) return "reddit";

  // Professional
  if (t.includes("linkedin") || t.includes("linked in")) return "linkedin";

  // Creator / media
  if (t.includes("youtube") || t.includes("youtuber")) return "youtube";
  if (t.includes("twitch") || t.includes("streamer")) return "twitch";
  if (t.includes("pinterest")) return "pinterest";
  if (t.includes("onlyfans") || t.includes("only fans")) return "onlyfans";

  // Marketplace / commerce
  if (t.includes("wallapop")) return "wallapop";
  if (t.includes("vinted")) return "vinted";
  if (t.includes("milanuncios")) return "milanuncios";
  if (t.includes("airbnb")) return "airbnb";
  if (t.includes("booking")) return "booking";

  return "unknown";
}

export function getProfilePlatformGroup(platform: ProfilePlatform): ProfilePlatformGroup {
  if (
    platform === "tinder" ||
    platform === "bumble" ||
    platform === "badoo" ||
    platform === "hinge" ||
    platform === "meetic" ||
    platform === "match" ||
    platform === "okcupid" ||
    platform === "pof" ||
    platform === "happn" ||
    platform === "grindr" ||
    platform === "facebook_dating"
  ) {
    return "dating";
  }

  if (
    platform === "facebook" ||
    platform === "instagram" ||
    platform === "tiktok" ||
    platform === "x" ||
    platform === "threads" ||
    platform === "snapchat" ||
    platform === "bereal" ||
    platform === "bluesky" ||
    platform === "mastodon"
  ) {
    return "social";
  }

  if (
    platform === "whatsapp" ||
    platform === "telegram" ||
    platform === "discord"
  ) {
    return "messaging";
  }

  if (platform === "reddit") return "community";

  if (platform === "linkedin") return "professional";

  if (
    platform === "youtube" ||
    platform === "twitch" ||
    platform === "pinterest" ||
    platform === "onlyfans"
  ) {
    return "creator";
  }

  if (
    platform === "wallapop" ||
    platform === "vinted" ||
    platform === "milanuncios" ||
    platform === "facebook_marketplace" ||
    platform === "airbnb" ||
    platform === "booking"
  ) {
    return "marketplace";
  }

  return "unknown";
}

export function looksLikeProfileReliabilityQuestion(userText: string) {
  const t = normalizeProfileText(userText);

  const profileWords =
    t.includes("perfil") ||
    t.includes("foto de perfil") ||
    t.includes("cuenta") ||
    t.includes("usuario") ||
    t.includes("persona") ||
    t.includes("contacto") ||
    t.includes("chat") ||
    t.includes("conversacion") ||
    t.includes("facebook") ||
    t.includes("instagram") ||
    t.includes("tinder") ||
    t.includes("bumble") ||
    t.includes("badoo") ||
    t.includes("hinge") ||
    t.includes("meetic") ||
    t.includes("grindr") ||
    t.includes("tiktok") ||
    t.includes("linkedin") ||
    t.includes("whatsapp") ||
    t.includes("telegram") ||
    t.includes("wallapop") ||
    t.includes("vinted");

  const reliabilityWords =
    t.includes("fiar") ||
    t.includes("fiarme") ||
    t.includes("fiable") ||
    t.includes("confiar") ||
    t.includes("confianza") ||
    t.includes("seguro") ||
    t.includes("segura") ||
    t.includes("falso") ||
    t.includes("falsa") ||
    t.includes("real") ||
    t.includes("sospechoso") ||
    t.includes("sospechosa") ||
    t.includes("estafa") ||
    t.includes("scam") ||
    t.includes("catfish") ||
    t.includes("suplantacion") ||
    t.includes("identidad") ||
    t.includes("me engana") ||
    t.includes("me engaña") ||
    t.includes("es verdad") ||
    t.includes("peligro") ||
    t.includes("riesgo");

  return profileWords && reliabilityWords;
}

function getPlatformDisplayName(platform: ProfilePlatform) {
  const names: Record<ProfilePlatform, string> = {
    tinder: "Tinder",
    bumble: "Bumble",
    badoo: "Badoo",
    hinge: "Hinge",
    meetic: "Meetic",
    match: "Match",
    okcupid: "OkCupid",
    pof: "Plenty of Fish",
    happn: "Happn",
    grindr: "Grindr",
    facebook_dating: "Facebook Dating",

    facebook: "Facebook",
    instagram: "Instagram",
    tiktok: "TikTok",
    x: "X/Twitter",
    threads: "Threads",
    snapchat: "Snapchat",
    bereal: "BeReal",
    bluesky: "Bluesky",
    mastodon: "Mastodon",

    whatsapp: "WhatsApp",
    telegram: "Telegram",
    discord: "Discord",
    reddit: "Reddit",

    linkedin: "LinkedIn",

    youtube: "YouTube",
    twitch: "Twitch",
    pinterest: "Pinterest",
    onlyfans: "OnlyFans",

    wallapop: "Wallapop",
    vinted: "Vinted",
    milanuncios: "Milanuncios",
    facebook_marketplace: "Facebook Marketplace",
    airbnb: "Airbnb",
    booking: "Booking",

    unknown: "plataforma no especificada",
  };

  return names[platform] ?? "plataforma no especificada";
}

function buildCommonProfileContext(platform: ProfilePlatform) {
  const platformName = getPlatformDisplayName(platform);

  return `
INTELIGENCIA GENERAL PARA ANÁLISIS DE PERFILES:
Plataforma detectada: ${platformName}

Principios:
- Analiza cada imagen/captura como un caso nuevo. No arrastres riesgo, color ni conclusión de análisis anteriores.
- Distingue siempre entre:
  1. perfil normal;
  2. perfil normal pero con poca información;
  3. perfil poco verificable;
  4. perfil sospechoso;
  5. perfil claramente peligroso.
- No alarmes sin señales reales.
- No pongas naranja solo por prudencia genérica.
- No pongas rojo salvo señales fuertes.
- Si el perfil parece normal y coherente, el veredicto debe ser bajo riesgo.
- Si falta contexto, pide más datos con buenas formas y explica qué dato ayudaría a afinar.
- Si la captura ya muestra una señal positiva, úsala directamente. No digas al usuario que la revise otra vez.
- Si la captura ya muestra una señal negativa clara, úsala directamente y explica por qué pesa.

Red flags universales fuertes:
- Foto reutilizada en fuentes claramente ajenas, con otra identidad o páginas sospechosas.
- Enlaces externos raros.
- Petición de dinero, Bizum, transferencia, tarjeta, crypto, inversión o trading.
- Petición de códigos, OTP, documentos, DNI, pasaporte, fotos íntimas o datos sensibles.
- Urgencia, presión, amenaza, chantaje o sextorsión.
- Historia emocional acelerada, love bombing o manipulación.
- Incoherencias fuertes entre nombre, país, idioma, ciudad, edad, trabajo, fotos o historia.
- Intento de sacar al usuario a otro canal de forma precipitada.
- Cuenta recién creada con pocas señales humanas y comportamiento interesado.

Green flags universales:
- Nombre realista para país/cultura/contexto aparente.
- Datos coherentes: ciudad, trabajo, estudios, actividad, idioma, edad aproximada.
- Fotos variadas y naturales.
- Comentarios/interacciones humanas.
- Familiares visibles o relaciones familiares coherentes.
- Amigos/contactos en común o personas conocidas que siguen/interactúan.
- Publicaciones con continuidad temporal.
- Ausencia de enlaces sospechosos.
- Ausencia de dinero, inversión, urgencia, códigos, documentos o presión.
- Coherencia entre lo que dice ser y lo que muestra.

Regla importante sobre contexto:
- Una señal aislada rara vez confirma algo.
- Varias señales verdes juntas bajan mucho la sospecha.
- Varias señales rojas juntas suben mucho el riesgo.
- La falta de información no prueba estafa; solo reduce verificabilidad.
`.trim();
}

function buildDatingContext(platform: ProfilePlatform) {
  const platformName = getPlatformDisplayName(platform);

  return `
INTELIGENCIA PARA APPS DE CITAS (${platformName}):
Aplica a Tinder, Bumble, Badoo, Hinge, Meetic, Match, OkCupid, Happn, Plenty of Fish, Grindr y Facebook Dating.

Green flags fuertes:
- Verificación visible junto al nombre/foto, si la plataforma la usa.
- Varias fotos naturales y variadas.
- Bio coherente.
- Edad, ciudad, distancia, idioma y estilo de vida consistentes.
- Conversación tranquila, sin urgencia ni presión.
- No pide dinero, inversión, cripto, regalos, códigos, documentos ni enlaces.
- No intenta sacar al usuario de la app de forma inmediata.
- Si la conversación avanza, acepta una comprobación natural sin ponerse agresivo/a.
- Responde de forma humana y consistente, no con guion genérico.
- No evita preguntas básicas normales.

Green flags suaves:
- Foto atractiva, de cuerpo entero, bikini, playa, gimnasio o pose cuidada: NO es riesgo por sí sola.
- Bio breve: puede ser normal en apps de citas; solo pesa si se combina con otras señales malas.
- No tener verificación visible: no prueba estafa.

Red flags fuertes:
- Foto reutilizada con otra identidad o en fuentes ajenas.
- Solo una foto demasiado perfecta/profesional y sin contexto.
- Quiere pasar rápido a WhatsApp/Telegram sin motivo.
- Habla de inversión, trading, crypto, ayudas económicas o emergencias.
- Pide dinero, Bizum, tarjeta, transferencia, códigos, documentos o fotos íntimas.
- Love bombing muy rápido.
- Historia dramática o urgencia emocional para pedir algo.
- Evita cualquier verificación razonable.
- Incoherencias de ciudad, país, idioma, edad, trabajo o historia personal.
- Enlaces externos raros.
- Mensajes que parecen plantilla.
- Excusas repetidas para no verse, no hablar o no confirmar identidad.
- Dice estar cerca pero su historia/idioma/fotos no encajan.

Reglas de veredicto:
- Perfil verificado + sin dinero/enlaces/presión/foto reutilizada = bajo riesgo.
- Foto sugerente o atractiva NO es señal de peligro por sí sola.
- Falta de verificación NO prueba estafa.
- Foto reutilizada en app de citas baja mucho la confianza y normalmente debe ser naranja.
- Si además hay dinero, inversión, cripto, códigos, documentos, sextorsión o presión, sube a rojo.
- Si solo falta información, usa precaución moderada, no alarma.
`.trim();
}

function buildFacebookContext() {
  return `
INTELIGENCIA PARA FACEBOOK:
Facebook se analiza como red social de identidad/contexto, no como app de citas.

Green flags fuertes:
- Nombre realista para país/cultura aparente.
- Nombre + apellidos, especialmente si encajan con idioma/lugar.
- Ciudad, colegio, universidad, trabajo o actividad coherente.
- Familiares visibles, sección Familia, apellidos compartidos o relaciones familiares naturales.
- Amigos/contactos en común o texto tipo “X sigue esta cuenta”.
- Muchas publicaciones o continuidad temporal.
- Comentarios naturales de otras personas.
- Fotos variadas en contextos distintos.
- Etiquetas, lugares y detalles cotidianos coherentes.
- Formación/trabajo/ubicación con sentido entre sí.
- Ausencia de enlaces sospechosos.
- Ausencia de dinero, crypto, inversión, urgencia, códigos, documentos o presión.

Familia:
- Familiares visibles son una señal positiva fuerte.
- Si aparece sección Familia, nombres de familiares, apellidos compartidos o relaciones familiares coherentes, úsalo directamente.
- No digas “revisa si tiene familiares” si ya se ve.

Amigos/contactos:
- Amigos en común, contactos compartidos o “X sigue esta cuenta” son señal positiva fuerte.
- Si se ve “X sigue esta cuenta”, úsalo directamente.
- No digas “verifica amigos en común” si la captura ya lo muestra.

Perfil con poca información:
- Si tiene datos básicos coherentes y no hay señales malas, no lo vuelvas naranja solo por ser limitado.
- Si casi no hay datos, no hay publicaciones, no hay amigos, no hay familia y solo hay una foto, puede ser “poco verificable”.
- Poco verificable no significa peligroso.

Red flags:
- Foto reutilizada en fuentes claramente ajenas o con otra identidad.
- Enlaces externos raros.
- Sorteos, inversión, crypto o promesas de dinero.
- Mensajes privados pidiendo datos, códigos, documentos o pagos.
- Suplantación clara.
- Cambios raros de identidad.
- Fotos robadas o actividad artificial.
- Nombre/ubicación/idioma/fotos que no encajan.
- Cuenta muy nueva con comportamiento interesado.

Reglas de veredicto:
- Datos coherentes + sin señales malas = verde.
- Datos coherentes + familia/amigos/contactos = verde más claro.
- Poca info pero nada raro = verde o naranja suave según cuánto falte, explicando que es por verificabilidad, no por peligro.
- Foto reutilizada en fuente ajena = naranja.
- Foto reutilizada + suplantación/dinero/enlaces = rojo.
- La búsqueda inversa no debe dominar si el perfil completo tiene contexto social sólido; puede ser miniatura, caché o foto del propio perfil.
`.trim();
}

function buildInstagramContext() {
  return `
INTELIGENCIA PARA INSTAGRAM:
Instagram se analiza por coherencia visual, actividad e interacciones.

Green flags:
- Fotos variadas y coherentes.
- Publicaciones con continuidad temporal.
- Comentarios naturales.
- Etiquetas reales.
- Seguidores/seguidos con proporción razonable.
- Historias destacadas coherentes.
- Bio normal, sin enlaces raros.
- Actividad relacionada con lo que dice ser o hacer.
- Amigos/contactos en común o interacciones de personas conocidas.
- Estilo visual consistente sin parecer banco de imágenes.
- Fotos en distintos lugares y momentos.

Green flags suaves:
- Perfil privado no significa estafa.
- No tener check azul no significa estafa.
- Pocas publicaciones pueden ser normal si hay otros datos coherentes.

Red flags:
- Foto robada/reutilizada con otra identidad.
- Enlaces sospechosos.
- Sorteos falsos, inversión, crypto, dinero fácil.
- Presión por DM.
- Pide datos, códigos, documentos o pagos.
- Suplantación de marca/persona.
- Actividad artificial clara.
- Comentarios genéricos/repetidos o comprados.
- Seguidores raros o incoherentes.
- Muchas fotos demasiado perfectas sin contexto.
- Cambios bruscos de identidad/tema.

Reglas de veredicto:
- Si lo visible es normal y no hay señales malas, no alarmes.
- Si falta mucha información, habla de “poco verificable”, no de peligro.
- Si hay enlace raro + promesa + presión, sube riesgo.
- Si hay foto reutilizada con otra identidad, naranja o rojo según contexto.
`.trim();
}

function buildTikTokContext() {
  return `
INTELIGENCIA PARA TIKTOK:
TikTok se analiza por contenido, patrón de publicación, comentarios e intención.

Green flags:
- Vídeos propios con continuidad.
- Comentarios naturales.
- Estilo/voz/persona consistentes.
- Bio coherente.
- Enlaces ausentes o normales.
- No hay promesas raras ni presión por DM.
- Interacciones reales.

Red flags:
- Cuenta que recicla vídeos de otras personas.
- Promesas de dinero, inversión, crypto, apuestas, trading o cursos milagro.
- Enlaces externos raros.
- Suplantación de influencer/marca.
- Comentarios artificiales.
- Pide ir a Telegram/WhatsApp para “ganar dinero”.
- Deepfakes o uso dudoso de imágenes de terceros.
- Sorteos falsos.

Reglas:
- Viralidad no significa fiabilidad.
- Muchos seguidores no prueban legitimidad.
- Si vende algo, mirar enlace, comentarios reales, antigüedad y coherencia.
`.trim();
}

function buildXThreadsContext(platform: ProfilePlatform) {
  const platformName = getPlatformDisplayName(platform);

  return `
INTELIGENCIA PARA ${platformName}:
Se analiza por historial, identidad, contenido, interacción y enlaces.

Green flags:
- Historial antiguo y coherente.
- Publicaciones consistentes con la identidad.
- Interacciones naturales.
- Enlaces normales o ausentes.
- Bio coherente.
- Menciones/respuestas humanas.
- Identidad consistente en el tiempo.

Red flags:
- Cuenta recién creada con actividad agresiva.
- Suplantación de marcas/personas.
- Enlaces de crypto, airdrops, sorteos, inversión o soporte falso.
- Urgencia, presión o “claim reward”.
- Respuestas repetitivas tipo bot.
- Cambios bruscos de nombre/foto/tema.
- Mensajes privados pidiendo datos/códigos/wallet.

Reglas:
- Check o suscripción no garantiza legitimidad.
- Analiza enlaces, historial y coherencia, no solo insignias.
- En crypto/airdrops/soporte técnico, sube mucho el riesgo.
`.trim();
}

function buildLinkedInContext() {
  return `
INTELIGENCIA PARA LINKEDIN:
LinkedIn se analiza por coherencia profesional.

Green flags:
- Nombre realista.
- Foto profesional normal.
- Experiencia laboral coherente.
- Estudios coherentes.
- Empresa real y cargo plausible.
- Historial temporal razonable.
- Contactos/interacciones profesionales.
- Publicaciones o actividad relacionadas con su sector.
- Recomendaciones o validaciones coherentes.

Red flags:
- Oferta de trabajo demasiado buena.
- Pide dinero para proceso, visado, material, formación o trámites.
- Pide documentos sensibles demasiado pronto.
- Email/dominio no corporativo para una empresa grande.
- Reclutador sin historial ni empresa clara.
- Incoherencias en cargo, empresa, país o idioma.
- Enlaces raros para aplicar.
- Crypto/inversión/network marketing camuflado.

Reglas:
- Perfil incompleto no prueba estafa, pero baja verificabilidad.
- Oferta + urgencia + dinero/documentos = riesgo alto.
- Verifica empresa, dominio, recruiter y proceso oficial.
`.trim();
}

function buildMessagingContext(platform: ProfilePlatform) {
  const platformName = getPlatformDisplayName(platform);

  return `
INTELIGENCIA PARA ${platformName}:
En mensajería importa más la conducta que el perfil visual.

Green flags:
- Contacto conocido o número coherente.
- Conversación natural.
- No pide dinero, códigos, documentos ni datos sensibles.
- No presiona.
- No manda enlaces raros.
- La identidad encaja con cómo habla y con el contexto.

Red flags:
- Dice ser banco, soporte, familiar o empresa y pide códigos/dinero.
- Urgencia o amenaza.
- Pide reenviar SMS/OTP.
- Pide instalar apps o dar acceso remoto.
- Enlaces acortados o raros.
- Quiere mover una operación sensible fuera del canal oficial.
- En Telegram, grupos de inversión, crypto, señales, sorteos o supuestos expertos.
- En Discord, mods/soporte falsos, enlaces de Steam/NFT/crypto, “verify account”.

Reglas:
- En WhatsApp/Telegram, foto/nombre pueden ser falsos fácilmente.
- Si hay códigos, banco, dinero o enlaces, sube riesgo.
- Si solo es un contacto normal sin petición sensible, no alarmes.
`.trim();
}

function buildMarketplaceContext(platform: ProfilePlatform) {
  const platformName = getPlatformDisplayName(platform);

  return `
INTELIGENCIA PARA ${platformName}:
En marketplaces y plataformas de compraventa, la fiabilidad depende de historial, pagos, canal y comportamiento.

Green flags:
- Perfil con antigüedad.
- Valoraciones reales y coherentes.
- Historial de ventas/compras.
- Fotos propias del producto/alojamiento.
- Comunicación normal.
- Pago dentro de la plataforma.
- No presiona para salir del sistema.
- Datos coherentes con la ubicación/anuncio.

Red flags:
- Quiere sacar la conversación fuera.
- Pide Bizum/transferencia fuera de plataforma sin garantías.
- Enlaces externos para pagar, reservar o verificar.
- Precio demasiado bueno.
- Urgencia artificial.
- Fotos robadas del producto/alojamiento.
- Perfil nuevo sin valoraciones.
- Excusas de envío/seguro/mensajería raras.
- En Airbnb/Booking: pide pagar fuera de la plataforma.
- En Wallapop/Vinted: falso comprador/vendedor que manda enlace de pago/envío.

Reglas:
- Perfil nuevo no prueba estafa, pero exige más cautela.
- Pago fuera de plataforma + enlace externo = riesgo alto.
- Mantener pago/chat dentro de plataforma reduce riesgo.
`.trim();
}

function buildCreatorContext(platform: ProfilePlatform) {
  const platformName = getPlatformDisplayName(platform);

  return `
INTELIGENCIA PARA ${platformName}:
En perfiles de creador importa la coherencia entre identidad, contenido, enlaces y monetización.

Green flags:
- Contenido propio y consistente.
- Historial de publicaciones.
- Comentarios naturales.
- Enlaces coherentes con la marca/persona.
- Misma identidad en varias plataformas.
- No hay presión ni promesas raras.
- Comunidad/interacciones reales.

Red flags:
- Suplantación de creador.
- Enlaces raros en bio o comentarios.
- Sorteos falsos.
- Mensajes privados pidiendo dinero/datos.
- Promesas de inversión, crypto, ganancias o premios.
- Contenido robado/reposteado como si fuera propio.
- Cuenta recién creada imitando a otra.
- En OnlyFans u otras plataformas de creator: perfiles falsos usando fotos robadas para llevar a pagos externos o chats privados.

Reglas:
- Muchos seguidores no garantizan legitimidad.
- Mira coherencia de enlaces oficiales, historial, comentarios y presencia cruzada.
`.trim();
}

function buildCommunityContext(platform: ProfilePlatform) {
  const platformName = getPlatformDisplayName(platform);

  return `
INTELIGENCIA PARA ${platformName}:
En comunidades importa historial, karma/reputación, patrón de actividad y enlaces.

Green flags:
- Historial antiguo.
- Participación coherente en comunidades.
- Comentarios humanos.
- Sin enlaces sospechosos.
- Reputación consistente.
- No pide datos sensibles.

Red flags:
- Cuenta recién creada.
- Spam de enlaces.
- DMs con inversión, crypto, soporte falso o premios.
- Suplantación de moderadores.
- Mensajes copiados.
- Urgencia o presión.
- Pide mover a Telegram/WhatsApp para dinero/inversión.

Reglas:
- Evalúa comportamiento, no solo nombre/foto.
`.trim();
}

function buildGenericSocialContext() {
  return `
INTELIGENCIA PARA RED SOCIAL NO ESPECIFICADA:
- Si parece una red social normal, evalúa nombre, foto, bio, actividad, publicaciones, comentarios, amigos/contactos, familiares, enlaces y coherencia general.
- No apliques reglas de Tinder si no es app de citas.
- No exijas verificación como requisito en perfiles normales.
- El check azul no es imprescindible.
- Familiares visibles y amigos/contactos en común son señales positivas fuertes.
- La ausencia de información no prueba peligro, pero puede hacer el perfil menos verificable.
- Si lo visible es coherente y no hay señales malas, no alarmes.
`.trim();
}

function buildProfileFormatContext(hasImage: boolean) {
  return `
FORMATO PARA PREGUNTAS SOBRE PERFILES:
- Aplica a todas las plataformas: apps de citas, redes sociales, mensajería, marketplaces, comunidades, perfiles profesionales y creadores.
- Si el usuario pregunta en texto, sin captura, NO uses “Lo que veo”.
- En preguntas generales tipo “¿un perfil verificado puede ser falso?”, “¿cómo saber si un perfil es falso?” o “¿cómo saber si estoy hablando con un perfil falso?”, responde como guía práctica, no como análisis visual.
- No hagas parecer que ya has detectado peligro en un perfil concreto si el usuario solo ha hecho una pregunta general.
- No uses “precaución moderada” como veredicto si solo estás explicando red flags generales.
- No uses consejos vagos como:
  “confía en tu instinto”,
  “haz caso a tu intuición”,
  “si algo no se siente bien”,
  “investiga el perfil”
  como cierre o consejo principal.
- Vonu debe ser productivo: si falta información, pide exactamente lo que falta.
- Si el usuario tiene una duda concreta, ofrece revisar el caso con él:
  “Si tienes el perfil o la conversación, mándame captura y lo reviso contigo.”
  “Con una captura puedo decirte si lo pondría en bajo riesgo, duda razonable o peligro claro.”
- Para afinar, pide datos concretos según el caso:
  captura del perfil, bio, fotos, verificación visible, conversación, enlaces, si pide dinero, si pide códigos/documentos, si intenta sacar al usuario de la plataforma, antigüedad, comentarios, amigos/contactos, valoraciones o actividad visible.
- Cierra siempre con una acción concreta, no con una frase vaga.

Estructura recomendada si es pregunta general sin imagen:
**Respuesta clara:**
**Señales que sí me harían desconfiar:**
**Señales que tranquilizan:**
**Qué revisaría contigo:**
**Para quedarte con la idea:**

Estructura recomendada si hay imagen/captura:
**Primera impresión:**
**Señales a favor:**
**Señales que revisaría:**
**Qué haría ahora:**
**Conclusión:**

Contexto del caso:
- Hay imagen/captura adjunta: ${hasImage ? "sí" : "no"}
`.trim();
}

function buildProfileFormatContext(hasImage: boolean) {
  return `
FORMATO PARA PREGUNTAS SOBRE PERFILES:
- Aplica a todas las plataformas: apps de citas, redes sociales, mensajería, marketplaces, comunidades, perfiles profesionales y creadores.
- Si el usuario pregunta en texto, sin captura, NO uses “Lo que veo”.
- En preguntas generales tipo “¿un perfil verificado puede ser falso?”, “¿cómo saber si un perfil es falso?” o “¿cómo saber si estoy hablando con un perfil falso?”, responde como guía práctica, no como análisis visual.
- No hagas parecer que ya has detectado peligro en un perfil concreto si el usuario solo ha hecho una pregunta general.
- No uses “precaución moderada” como veredicto si solo estás explicando red flags generales.
- No uses consejos vagos como:
  “confía en tu instinto”,
  “haz caso a tu intuición”,
  “si algo no se siente bien”,
  “investiga el perfil”
  como cierre o consejo principal.
- Vonu debe ser productivo: si falta información, pide exactamente lo que falta.
- Si el usuario tiene una duda concreta, ofrece revisar el caso con él:
  “Si tienes el perfil o la conversación, mándame captura y lo reviso contigo.”
  “Con una captura puedo decirte si lo pondría en bajo riesgo, duda razonable o peligro claro.”
- Para afinar, pide datos concretos según el caso:
  captura del perfil, bio, fotos, verificación visible, conversación, enlaces, si pide dinero, si pide códigos/documentos, si intenta sacar al usuario de la plataforma, antigüedad, comentarios, amigos/contactos, valoraciones o actividad visible.
- Cierra siempre con una acción concreta, no con una frase vaga.

Estructura recomendada si es pregunta general sin imagen:
**Respuesta clara:**
**Señales que sí me harían desconfiar:**
**Señales que tranquilizan:**
**Qué revisaría contigo:**
**Para quedarte con la idea:**

Estructura recomendada si hay imagen/captura:
**Primera impresión:**
**Señales a favor:**
**Señales que revisaría:**
**Qué haría ahora:**
**Conclusión:**

Contexto del caso:
- Hay imagen/captura adjunta: ${hasImage ? "sí" : "no"}
`.trim();
}

export function buildProfileIntelligenceContext(params: {
  platform: ProfilePlatform;
  hasImage: boolean;
}) {
  const { platform, hasImage } = params;

  const group = getProfilePlatformGroup(platform);

  let platformContext = buildGenericSocialContext();

  if (group === "dating") {
    platformContext = buildDatingContext(platform);
  } else if (platform === "facebook") {
    platformContext = buildFacebookContext();
  } else if (platform === "instagram") {
    platformContext = buildInstagramContext();
  } else if (platform === "tiktok") {
    platformContext = buildTikTokContext();
  } else if (platform === "x" || platform === "threads" || platform === "bluesky" || platform === "mastodon") {
    platformContext = buildXThreadsContext(platform);
  } else if (platform === "linkedin") {
    platformContext = buildLinkedInContext();
  } else if (group === "messaging") {
    platformContext = buildMessagingContext(platform);
  } else if (group === "marketplace") {
    platformContext = buildMarketplaceContext(platform);
  } else if (group === "creator") {
    platformContext = buildCreatorContext(platform);
  } else if (group === "community") {
    platformContext = buildCommunityContext(platform);
  }

  return `
${buildCommonProfileContext(platform)}

${buildProfileFormatContext(hasImage)}

${platformContext}
`.trim();
}