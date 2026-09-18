const visualCss = `
.vonu-check-page.vonu-check-page main > section[data-vonu-subject-mode]::before {
  content: none !important;
  display: none !important;
}

.vonu-check-page.vonu-check-page main > section[data-vonu-subject-mode] > div:first-child {
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

.vonu-check-page.vonu-check-page main > section[data-vonu-subject-mode="capture"] > img:first-child {
  display: block !important;
  width: 48px !important;
  min-width: 48px !important;
  height: 48px !important;
  flex: 0 0 48px !important;
  align-self: center !important;
  padding: 13px !important;
  border-radius: 12px !important;
  border: 1px solid rgba(123,183,255,.28) !important;
  background-color: rgba(123,183,255,.065) !important;
  box-shadow: inset 0 0 0 1px rgba(123,183,255,.025) !important;
  content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'%3E%3Crect x='3' y='3' width='18' height='18' rx='2.5' stroke='%237bb7ff' stroke-width='1.9'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5' stroke='%237bb7ff' stroke-width='1.8'/%3E%3Cpath d='m21 15-5-5L5 21' stroke='%237bb7ff' stroke-width='1.9' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") !important;
  object-fit: contain !important;
}

.vonu-check-page.vonu-check-page [data-vonu-radar="true"] > div:last-child {
  display: none !important;
}
`;

export default function CheckVisualOverrides() {
  return <style>{visualCss}</style>;
}
