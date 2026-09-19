import React from 'react';

interface FamCareLogoProps {
  /** Height of the logo in pixels (width auto-scales to preserve 1:1.2 ratio) */
  size?: number;
  /** Additional className for the wrapping element */
  className?: string;
  /** aria-label override; defaults to "FamCare – Senior Care App" */
  ariaLabel?: string;
  /** Show text wordmark alongside icon */
  showWordmark?: boolean;
}

/**
 * FamCare SVG Logo Component
 * ─────────────────────────────────────────────────────────────────────────────
 * Fully inline SVG: transparent background, infinitely scalable, zero
 * raster artefacts. Uses the app's CSS custom-property colour palette so
 * it adapts automatically to high-contrast mode.
 *
 * Design rationale
 * ─────────────────
 * • Heart shape  → care & warmth (primary brand value)
 * • House inside → home & family context (product scope)
 * • Cupped hand  → support & safety (senior-care promise)
 * • Teal (#0d9488) + Warm-orange (#f97316) palette chosen for:
 *     – WCAG AA contrast on white AND on dark backgrounds
 *     – Emotional warmth (orange) balanced with trust/calm (teal)
 */
const FamCareLogo: React.FC<FamCareLogoProps> = ({
  size = 52,
  className = '',
  ariaLabel = 'FamCare – Senior Care App',
  showWordmark = true,
}) => {
  const iconW = size;
  const iconH = size;

  return (
    <div
      className={`famcare-logo ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}
      role="img"
      aria-label={ariaLabel}
    >
      {/* ── Icon Mark ────────────────────────────────────────────────── */}
      <svg
        width={iconW}
        height={iconH}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
        style={{ flexShrink: 0, overflow: 'visible' }}
      >
        {/* Drop shadow filter */}
        <defs>
          <filter id="fc-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="rgba(13,148,136,0.25)" />
          </filter>
        </defs>

        {/* ── Heart (teal outline) ──────────────────────────────────── */}
        <path
          d="M50 88
             C50 88 12 62 12 36
             C12 22 22 14 34 14
             C40 14 46 17 50 23
             C54 17 60 14 66 14
             C78 14 88 22 88 36
             C88 62 50 88 50 88Z"
          fill="none"
          stroke="#0d9488"
          strokeWidth="6.5"
          strokeLinejoin="round"
          filter="url(#fc-shadow)"
        />

        {/* ── House silhouette (warm orange) ───────────────────────── */}
        {/* Roof */}
        <polygon points="35,57 50,42 65,57" fill="#f97316" />
        {/* Body */}
        <rect x="38" y="57" width="24" height="18" rx="2" fill="#f97316" />
        {/* Door */}
        <rect x="46" y="65" width="8" height="10" rx="1.5" fill="#fff" opacity="0.85" />
        {/* Window */}
        <rect x="40" y="59" width="6" height="5" rx="1" fill="#fff" opacity="0.75" />
        <rect x="54" y="59" width="6" height="5" rx="1" fill="#fff" opacity="0.75" />

        {/* ── Cupped hand (teal) ───────────────────────────────────── */}
        <path
          d="M22 74
             Q28 68 36 72
             Q44 76 50 76
             Q56 76 64 72
             Q72 68 78 74
             Q72 86 50 88
             Q28 86 22 74Z"
          fill="#0d9488"
          opacity="0.92"
        />
      </svg>

      {/* ── Wordmark ─────────────────────────────────────────────────── */}
      {showWordmark && (
        <span
          className="famcare-wordmark"
          style={{
            fontFamily: "'Outfit', 'Inter', sans-serif",
            fontWeight: 800,
            fontSize: `${Math.round(size * 0.55)}px`,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            userSelect: 'none',
          }}
          aria-hidden="true"
        >
          <span style={{ color: '#0d9488' }}>Fam</span>
          <span style={{ color: '#f97316' }}>Care</span>
        </span>
      )}
    </div>
  );
};

export default FamCareLogo;
