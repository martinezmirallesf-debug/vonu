import Link from "next/link";

export default function HomeFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-[#f8f9fa]">
      <div className="mx-auto grid max-w-[1500px] gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.1fr_0.9fr_0.9fr_0.9fr] lg:px-8">
        <div>
          <span className="text-[20px] font-semibold tracking-[-0.045em] text-zinc-950">
            VonuAI
          </span>

          <p className="mt-4 max-w-sm text-[14px] leading-7 text-zinc-600">
            VonuAI ayuda a revisar decisiones importantes antes de firmar,
            pagar, contestar o decidir.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
  <Link
    href="/chat"
    className="inline-flex rounded-full bg-zinc-950 px-4 py-2 text-[14px] font-semibold text-white shadow-sm transition hover:scale-[1.02] active:scale-[0.99]"
  >
    Probar Vonu
  </Link>
</div>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-zinc-950">
            Producto
          </h3>

          <div className="mt-4 grid gap-3 text-[14px] text-zinc-600">
            <Link href="/producto" className="hover:text-zinc-950">
  Producto
</Link>
<Link href="/casos-de-uso" className="hover:text-zinc-950">
  Casos de uso
</Link>
            <Link href="/precios" className="hover:text-zinc-950">
              Precios
            </Link>
            <Link href="/como-funciona" className="hover:text-zinc-950">
  Cómo funciona
</Link>
            <Link href="/contacto" className="hover:text-zinc-950">
  Contacto
</Link>
          </div>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-zinc-950">
            Recursos
          </h3>

          <div className="mt-4 grid gap-3 text-[14px] text-zinc-600">
            <Link href="/recursos" className="hover:text-zinc-950">
              Recursos Vonu
            </Link>
            <Link href="/analizar-sms-estafa" className="hover:text-zinc-950">
              Analizar SMS sospechoso
            </Link>
            <Link href="/comprobar-web-fiable" className="hover:text-zinc-950">
              Comprobar web fiable
            </Link>
            <Link href="/revisar-contrato" className="hover:text-zinc-950">
              Revisar contrato
            </Link>
            <Link href="/comprobar-factura" className="hover:text-zinc-950">
              Comprobar factura
            </Link>
            <Link href="/detectar-manipulacion" className="hover:text-zinc-950">
  Detectar manipulación
</Link>

<Link href="/comprobar-tienda-online" className="hover:text-zinc-950">
  Comprobar tienda online
</Link>
          </div>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-zinc-950">
            Legal
          </h3>

          <div className="mt-4 grid gap-3 text-[14px] text-zinc-600">
            <Link href="/legal/aviso-legal" className="hover:text-zinc-950">
              Aviso legal
            </Link>
            <Link href="/legal/privacidad" className="hover:text-zinc-950">
              Privacidad
            </Link>
            <Link href="/legal/terminos" className="hover:text-zinc-950">
              Términos
            </Link>
            <Link href="/legal/cookies" className="hover:text-zinc-950">
              Cookies
            </Link>
            <Link href="/legal/uso-responsable" className="hover:text-zinc-950">
              Uso responsable
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200 px-4 py-5 text-center text-[13px] text-zinc-500">
        © {new Date().getFullYear()} VonuAI. Orientación preventiva. No sustituye profesionales.
      </div>
    </footer>
  );
}