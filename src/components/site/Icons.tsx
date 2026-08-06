type IconProps = { name: string; className?: string };

/**
 * Set de iconos propio (trazos estilo lucide + glifos de marca).
 * Todos decorativos: aria-hidden. El texto accesible lo aporta el contexto.
 */
export function Icon({ name, className = "h-5 w-5" }: IconProps) {
  const stroke = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "bolt":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2Z" />
        </svg>
      );
    case "droplet":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <path d="M12 3s6.5 6.5 6.5 11a6.5 6.5 0 1 1-13 0C5.5 9.5 12 3 12 3Z" />
          <path d="M9 14.5a3.2 3.2 0 0 0 2.2 3" />
        </svg>
      );
    case "paint":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <rect x="3" y="3.5" width="14" height="6" rx="1.5" />
          <path d="M17 5.5h2.5a1 1 0 0 1 1 1V9a2 2 0 0 1-2 2H12a1.5 1.5 0 0 0-1.5 1.5v1" />
          <rect x="9" y="13.5" width="3" height="7" rx="1" />
        </svg>
      );
    case "wall":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <rect x="3" y="4" width="18" height="16" rx="1.5" />
          <path d="M3 9.5h18M3 15h18M9 4v5.5M15 9.5V15M9 15v5" />
        </svg>
      );
    case "hammer":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <path d="m13.5 8.5 7 7-2 2-7-7" />
          <path d="M9 3.5 4.5 8l2.5 2.5L3.5 14 6 16.5l3.5-3.5L12 15.5 16.5 11 9 3.5Z" />
        </svg>
      );
    case "sofa":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <path d="M5 10V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" />
          <path d="M3 13a2 2 0 0 1 4 0v1h10v-1a2 2 0 0 1 4 0v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3Z" />
          <path d="M5.5 18v1.5M18.5 18v1.5" />
        </svg>
      );
    case "kitchen":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <rect x="4" y="3.5" width="16" height="17" rx="1.5" />
          <path d="M4 9.5h16" />
          <circle cx="8.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
          <circle cx="12" cy="6.5" r="1" fill="currentColor" stroke="none" />
          <circle cx="15.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
          <rect x="7.5" y="12.5" width="9" height="4.5" rx="0.8" />
        </svg>
      );
    case "wrench":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <path d="M14 6.5a4.5 4.5 0 0 1 5.6-4.3l-3 3 .7 2.5 2.5.7 3-3A4.5 4.5 0 0 1 17 11.5c-.5 0-1-.08-1.44-.24L7 19.8a2.1 2.1 0 0 1-3-3l8.54-8.56A4.5 4.5 0 0 1 14 6.5Z" transform="translate(-1.5 1)" />
        </svg>
      );
    case "building":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <rect x="5" y="3.5" width="14" height="17" rx="1" />
          <path d="M9 20.5v-4h6v4M9 7.5h2M13 7.5h2M9 11h2M13 11h2" />
          <path d="M3 20.5h18" />
        </svg>
      );
    case "ruler":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <rect x="2.5" y="9" width="19" height="6" rx="1" transform="rotate(-25 12 12)" />
          <path d="m8 13.5 1 1.8M11.5 11.8l1 1.8M15 10.2l1 1.8" />
        </svg>
      );
    case "phone":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <path d="M5.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3.5 5.7a2 2 0 0 1 2-2.2Z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
          <path d="M12 2a9.9 9.9 0 0 0-8.5 15L2 22l5.2-1.4A9.9 9.9 0 1 0 12 2Zm0 1.8a8.1 8.1 0 1 1-4.1 15.1l-.3-.17-3 .8.8-2.95-.18-.3A8.1 8.1 0 0 1 12 3.8Zm-3.1 4c-.2 0-.5.07-.75.35-.26.28-1 .96-1 2.34 0 1.38 1 2.72 1.15 2.9.14.2 1.97 3.12 4.86 4.25 2.4.94 2.9.75 3.42.7.52-.05 1.68-.68 1.92-1.34.24-.66.24-1.23.17-1.35-.07-.12-.26-.2-.55-.33-.28-.14-1.68-.83-1.94-.92-.26-.1-.45-.14-.64.14-.19.28-.73.92-.9 1.1-.16.2-.33.22-.61.08a7.7 7.7 0 0 1-2.27-1.4 8.5 8.5 0 0 1-1.58-1.96c-.16-.28-.02-.44.12-.58.13-.12.3-.33.43-.5.14-.16.19-.28.28-.47.1-.19.05-.35-.02-.5-.07-.14-.62-1.54-.87-2.1-.23-.55-.47-.4-.64-.4Z" />
        </svg>
      );
    case "mail":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3.5 7 8.5 6 8.5-6" />
        </svg>
      );
    case "map-pin":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
          <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9 2.9-6Z" />
        </svg>
      );
    case "clock":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3.5 2" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <path d="M12 2.5 4.5 5.5v6c0 4.7 3.2 8 7.5 10 4.3-2 7.5-5.3 7.5-10v-6L12 2.5Z" />
          <path d="m8.8 12 2.2 2.2 4.2-4.4" />
        </svg>
      );
    case "check":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <path d="m4.5 12.5 5 5 10-11" />
        </svg>
      );
    case "chevron-right":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <path d="m9 5 7 7-7 7" />
        </svg>
      );
    case "arrow-right":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <path d="M4 12h16m0 0-6-6m6 6-6 6" />
        </svg>
      );
    case "menu":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
          <path d="M14 8.5V6.8c0-.8.5-1 1-1h2.5V2.5h-3.2C11.6 2.5 10.5 4.6 10.5 6.5v2H8v3.3h2.5v9.7H14v-9.7h2.8l.4-3.3H14Z" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
          <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26.2 26.2 0 0 0 22 12a26.2 26.2 0 0 0-.4-4.8ZM10 15.2V8.8l5.5 3.2-5.5 3.2Z" />
        </svg>
      );
    case "wallapop":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <path d="M6 7.5h12l-1.2 11a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 7.5Z" />
          <path d="M9 10V6a3 3 0 0 1 6 0v4" />
        </svg>
      );
    case "milanuncios":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <path d="M3.5 11v2a1.5 1.5 0 0 0 1.5 1.5h2l6.5 4v-13L7 9.5H5A1.5 1.5 0 0 0 3.5 11Z" />
          <path d="M17 9.5a4 4 0 0 1 0 5M19.5 7.5a7.5 7.5 0 0 1 0 9" />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
          <path d="M6.5 8.8H3.4V21h3.1V8.8ZM5 7.4a1.9 1.9 0 1 0 0-3.9 1.9 1.9 0 0 0 0 3.9ZM21 14.2c0-3.4-1.8-5.6-4.5-5.6a3.9 3.9 0 0 0-3.4 1.8V8.8H10V21h3.1v-6.4c0-1.7.8-2.7 2.2-2.7 1.3 0 2.1.9 2.1 2.7V21H21v-6.8Z" />
        </svg>
      );
    case "play":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
          <path d="M8 5.2v13.6c0 .8.9 1.3 1.5.8l10-6.8a1 1 0 0 0 0-1.6l-10-6.8c-.6-.4-1.5 0-1.5.8Z" />
        </svg>
      );
    case "camera":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <path d="M4 7.5h3l1.5-2.5h7L17 7.5h3a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8.5a1 1 0 0 1 1-1Z" />
          <circle cx="12" cy="13.5" r="3.5" />
        </svg>
      );
    case "send":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <path d="M21 3 3 10.5l7 2.5m11-10-5.5 18L13 13m8-10L10 13" />
        </svg>
      );
    case "alert":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <path d="M12 3.5 2.5 20h19L12 3.5Z" />
          <path d="M12 10v4.5" />
          <circle cx="12" cy="17.3" r=".9" fill="currentColor" stroke="none" />
        </svg>
      );
    case "users":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <circle cx="9" cy="8.5" r="3.5" />
          <path d="M3 20a6 6 0 0 1 12 0" />
          <path d="M16 5.5a3.5 3.5 0 0 1 0 6M18.5 20a6 6 0 0 0-3.5-5.4" />
        </svg>
      );
    case "file-text":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <path d="M6 3.5h8L19 8.5V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
          <path d="M14 3.5v5h5M8.5 12.5h7M8.5 16h7" />
        </svg>
      );
    case "sparkles":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <path d="M12 4 13.8 9.2 19 11l-5.2 1.8L12 18l-1.8-5.2L5 11l5.2-1.8L12 4Z" />
          <path d="M19 3.5v3M20.5 5h-3M5 17.5v3M6.5 19h-3" />
        </svg>
      );
    case "home":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <path d="m3.5 11 8.5-7.5L20.5 11" />
          <path d="M5.5 9.5V20a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V9.5" />
          <path d="M10 21v-6h4v6" />
        </svg>
      );
    case "gallery":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
          <circle cx="9" cy="10" r="1.8" />
          <path d="m4.5 17.5 4.5-4 3.5 3 3-2.5 4 3.5" />
        </svg>
      );
    case "gear":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <circle cx="12" cy="12" r="3.2" />
          <path d="M12 2.8v2.7M12 18.5v2.7M2.8 12h2.7M18.5 12h2.7M5.5 5.5l1.9 1.9M16.6 16.6l1.9 1.9M18.5 5.5l-1.9 1.9M7.4 16.6l-1.9 1.9" />
        </svg>
      );
    case "logout":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <path d="M9 4.5H5.5a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1H9" />
          <path d="M15 8.5 19 12l-4 3.5M19 12H9.5" />
        </svg>
      );
    case "inbox":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <path d="M4 13.5 6.5 5h11L20 13.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-5.5Z" />
          <path d="M4 13.5h4.5l1.5 2.5h4l1.5-2.5H20" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...stroke}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}
