/**
 * GalleryPlaceholder — drop-in replacement for a real photo.
 * Replace the whole component with a plain <img> once you have a real photo.
 *
 * Props:
 *   color   – accent hex used for the tinted bg (e.g. '#006b1e')
 *   label   – short label shown at the bottom (e.g. 'AREA-51 R5 · INTERNALS')
 *   slot    – slot / id number shown top-right for quick reference
 */
export default function GalleryPlaceholder({ color = '#006b1e', label = '', slot = '' }) {
  // Derive a lighter tint from the accent color for the background
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 320 200"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', position: 'absolute', inset: 0 }}
      aria-label="Photo placeholder"
    >
      {/* Background */}
      <rect width="320" height="200" fill="#0a0a10" />

      {/* Subtle grid */}
      <defs>
        <pattern id={`grid-${slot}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke={color} strokeWidth="0.3" strokeOpacity="0.35" />
        </pattern>
      </defs>
      <rect width="320" height="200" fill={`url(#grid-${slot})`} />

      {/* Corner accent */}
      <rect x="0" y="0" width="4" height="40" fill={color} opacity="0.7" />
      <rect x="0" y="0" width="40" height="4" fill={color} opacity="0.7" />
      <rect x="276" y="196" width="44" height="4" fill={color} opacity="0.7" />
      <rect x="316" y="160" width="4" height="40" fill={color} opacity="0.7" />

      {/* Dashed border */}
      <rect
        x="12" y="12" width="296" height="176"
        fill="none"
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.3"
        strokeDasharray="6 4"
        rx="2"
      />

      {/* Camera icon */}
      <g transform="translate(160,90)" opacity="0.5">
        {/* Body */}
        <rect x="-22" y="-14" width="44" height="30" rx="4" fill="none" stroke={color} strokeWidth="1.5" />
        {/* Lens */}
        <circle cx="0" cy="1" r="9" fill="none" stroke={color} strokeWidth="1.5" />
        <circle cx="0" cy="1" r="4" fill={color} opacity="0.4" />
        {/* Viewfinder bump */}
        <rect x="-7" y="-20" width="14" height="7" rx="2" fill="none" stroke={color} strokeWidth="1.5" />
        {/* Flash dot */}
        <circle cx="15" cy="-8" r="2.5" fill={color} opacity="0.6" />
      </g>

      {/* "ADD PHOTO" text */}
      <text
        x="160" y="136"
        textAnchor="middle"
        fill={color}
        opacity="0.55"
        fontSize="8"
        fontFamily="'Share Tech Mono', monospace"
        letterSpacing="3"
      >
        ADD PHOTO
      </text>

      {/* Slot number top-right */}
      {slot && (
        <text
          x="308" y="26"
          textAnchor="end"
          fill={color}
          opacity="0.4"
          fontSize="9"
          fontFamily="'Share Tech Mono', monospace"
          letterSpacing="1"
        >
          #{slot}
        </text>
      )}

      {/* Label bottom */}
      {label && (
        <text
          x="160" y="190"
          textAnchor="middle"
          fill={color}
          opacity="0.45"
          fontSize="7"
          fontFamily="'Share Tech Mono', monospace"
          letterSpacing="2"
        >
          {label.toUpperCase()}
        </text>
      )}
    </svg>
  )
}
