const visualCss = `
.vonu-check-page.vonu-check-page main > section[data-vonu-subject-mode]::before {
  content: none !important;
  display: none !important;
}

.vonu-check-page.vonu-check-page main > section[data-vonu-subject-mode="url"] > div:first-child,
.vonu-check-page.vonu-check-page main > section[data-vonu-subject-mode="text"] > div:first-child {
  display: grid !important;
  width: 48px !important;
  min-width: 48px !important;
  height: 48px !important;
  flex: 0 0 48px !important;
  place-items: center !important;
  align-self: center !important;
  padding: 0 !important;
  border-radius: 12px !important;
  border: 1px solid rgba(123,183,255,.28) !important;
  background-color: rgba(123,183,255,.065) !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
  background-size: 22px 22px !important;
  box-shadow: inset 0 0 0 1px rgba(123,183,255,.025) !important;
  color: transparent !important;
  font-size: 0 !important;
  line-height: 0 !important;
}

.vonu-check-page.vonu-check-page main > section[data-vonu-subject-mode="url"] > div:first-child {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' stroke='%237bb7ff' stroke-width='1.9' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' stroke='%237bb7ff' stroke-width='1.9' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") !important;
}

.vonu-check-page.vonu-check-page main > section[data-vonu-subject-mode="text"] > div:first-child {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z' stroke='%237bb7ff' stroke-width='1.9' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M7.5 8.5h9M7.5 12.5h6' stroke='%237bb7ff' stroke-width='1.9' stroke-linecap='round'/%3E%3C/svg%3E") !important;
}

.vonu-check-page.vonu-check-page main > section[data-vonu-subject-mode="capture"] > img:first-child,
.vonu-check-page.vonu-check-page main > section[data-vonu-subject-mode="capture"] > img[data-vonu-capture-thumbnail="true"] {
  display: block !important;
  width: 48px !important;
  min-width: 48px !important;
  height: 48px !important;
  flex: 0 0 48px !important;
  align-self: center !important;
  padding: 0 !important;
  border-radius: 12px !important;
  border: 1px solid rgba(123,183,255,.28) !important;
  background: rgba(123,183,255,.04) !important;
  box-shadow: inset 0 0 0 1px rgba(123,183,255,.025) !important;
  object-fit: cover !important;
  object-position: center !important;
}

.vonu-check-page.vonu-check-page [data-vonu-radar="true"] > div:last-child {
  display: none !important;
}

@media (min-width: 768px) and (max-width: 1023px) {
  /* Match the real URL field surface in the desktop/tablet-width layout. */
  .vonu-check-page.vonu-check-page main
    > section[data-vonu-idle-mode="text"]
    > div:last-child
    > textarea[data-vonu-message-input="true"] {
    margin: 6px 10px 0 !important;
    border: 0 !important;
    border-radius: 13px !important;
    background: #0d1220 !important;
    background-color: #0d1220 !important;
    background-image: none !important;
    box-shadow: none !important;
    outline: none !important;
    opacity: 1 !important;
  }

  .vonu-check-page.vonu-check-page main
    > section[data-vonu-idle-mode="text"]
    > div:last-child:has(> textarea[data-vonu-message-input="true"])
    > [data-vonu-cta-stack="true"] {
    margin: 24px 0 0 !important;
    gap: 9px !important;
  }
}

@media (min-width: 1024px) {
  /* Final PC top-edge parity: URL and Message fields start at the exact same Y coordinate. */
  .vonu-check-page.vonu-check-page main:has(> section.text-center)
    > section:nth-of-type(2)[data-vonu-idle-mode="url"]
    > div:last-child,
  .vonu-check-page.vonu-check-page main:has(> section.text-center)
    > section:nth-of-type(2)[data-vonu-idle-mode="text"]
    > div:last-child:has(> textarea[data-vonu-message-input="true"]) {
    padding-top: 18px !important;
  }

  .vonu-check-page.vonu-check-page main:has(> section.text-center)
    > section:nth-of-type(2)[data-vonu-idle-mode="url"]
    > div:last-child
    > [data-vonu-url-input-shell="true"],
  .vonu-check-page.vonu-check-page main:has(> section.text-center)
    > section:nth-of-type(2)[data-vonu-idle-mode="text"]
    > div:last-child:has(> textarea[data-vonu-message-input="true"])
    > textarea[data-vonu-message-input="true"] {
    margin-top: 10px !important;
  }
}

@media (min-width: 1024px) and (max-height: 760px) {
  .vonu-check-page.vonu-check-page main:has(> section.text-center)
    > section:nth-of-type(2)[data-vonu-idle-mode="url"]
    > div:last-child,
  .vonu-check-page.vonu-check-page main:has(> section.text-center)
    > section:nth-of-type(2)[data-vonu-idle-mode="text"]
    > div:last-child:has(> textarea[data-vonu-message-input="true"]) {
    padding-top: 12px !important;
  }

  .vonu-check-page.vonu-check-page main:has(> section.text-center)
    > section:nth-of-type(2)[data-vonu-idle-mode="url"]
    > div:last-child
    > [data-vonu-url-input-shell="true"],
  .vonu-check-page.vonu-check-page main:has(> section.text-center)
    > section:nth-of-type(2)[data-vonu-idle-mode="text"]
    > div:last-child:has(> textarea[data-vonu-message-input="true"])
    > textarea[data-vonu-message-input="true"] {
    margin-top: 10px !important;
  }
}

@media (min-width: 1024px) {
  /* Screenshot-verified desktop Message authority.
     The :has + nth-of-type selector intentionally outranks the generic CTA rule. */
  .vonu-check-page.vonu-check-page main:has(> section.text-center)
    > section:nth-of-type(2)[data-vonu-idle-mode="text"]
    > div:last-child:has(> textarea[data-vonu-message-input="true"]) {
    row-gap: 0 !important;
  }

  .vonu-check-page.vonu-check-page main:has(> section.text-center)
    > section:nth-of-type(2)[data-vonu-idle-mode="text"]
    > div:last-child:has(> textarea[data-vonu-message-input="true"])
    > textarea[data-vonu-message-input="true"] {
    margin-top: 10px !important;
    margin-bottom: 0 !important;
    border: 1px solid rgb(35, 59, 97) !important;
    border-radius: 18px !important;
    background: rgba(7, 12, 24, .56) !important;
    background-color: rgba(7, 12, 24, .56) !important;
    background-image: none !important;
    -webkit-appearance: none !important;
    appearance: none !important;
    box-shadow: none !important;
    outline: none !important;
    opacity: 1 !important;
  }

  .vonu-check-page.vonu-check-page main:has(> section.text-center)
    > section:nth-of-type(2)[data-vonu-idle-mode="text"]
    > div:last-child:has(> textarea[data-vonu-message-input="true"])
    > textarea[data-vonu-message-input="true"]:focus {
    border-color: rgba(123, 183, 255, .62) !important;
    background: rgba(7, 12, 24, .56) !important;
    box-shadow: 0 0 0 1px rgba(123, 183, 255, .08) !important;
  }

  .vonu-check-page.vonu-check-page main:has(> section.text-center)
    > section:nth-of-type(2)[data-vonu-idle-mode="text"]
    > div:last-child:has(> textarea[data-vonu-message-input="true"])
    > [data-vonu-cta-stack="true"] {
    margin: 42px 0 0 !important;
    gap: 9px !important;
  }
}

@media (min-width: 1024px) and (max-height: 760px) {
  .vonu-check-page.vonu-check-page main:has(> section.text-center)
    > section:nth-of-type(2)[data-vonu-idle-mode="text"]
    > div:last-child:has(> textarea[data-vonu-message-input="true"])
    > [data-vonu-cta-stack="true"] {
    margin-top: 36px !important;
  }
}
`;

export default function CheckVisualOverrides() {
  return <style>{visualCss}</style>;
}
