// 공용 인라인 SVG 아이콘 — currentColor 기반, 크기는 CSS로 제어
const base = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export function IconHeart({ filled = false }) {
  return (
    <svg {...base} fill={filled ? "currentColor" : "none"}>
      <path d="M12 21c-4.8-3.4-8.4-6.6-8.4-10.4C3.6 7.5 6 5.4 8.6 5.4c1.4 0 2.7.7 3.4 1.8.7-1.1 2-1.8 3.4-1.8 2.6 0 5 2.1 5 5.2C20.4 14.4 16.8 17.6 12 21z" />
    </svg>
  );
}

export function IconCamera() {
  return (
    <svg {...base}>
      <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1.4-2h6.2L16.5 7h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-9z" />
      <circle cx="12" cy="13" r="3.2" />
    </svg>
  );
}

export function IconDownload() {
  return (
    <svg {...base}>
      <path d="M12 4v11m0 0 4.2-4.2M12 15 7.8 10.8" />
      <path d="M4.5 19.5h15" />
    </svg>
  );
}

export function IconClose() {
  return (
    <svg {...base}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function IconCopy() {
  return (
    <svg {...base}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5" />
    </svg>
  );
}

export function IconCheck() {
  return (
    <svg {...base}>
      <path d="M4.5 12.5 10 18 19.5 7" />
    </svg>
  );
}

export function IconArrow({ dir = "right" }) {
  return (
    <svg {...base} style={dir === "left" ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M9 5.5 15.5 12 9 18.5" />
    </svg>
  );
}

export function IconExternal() {
  return (
    <svg {...base}>
      <path d="M9.5 5H5.8A1.8 1.8 0 0 0 4 6.8v11.4A1.8 1.8 0 0 0 5.8 20h11.4a1.8 1.8 0 0 0 1.8-1.8v-3.7" />
      <path d="M14 4h6v6M20 4 11 13" />
    </svg>
  );
}

export function IconCompare() {
  return (
    <svg {...base}>
      <rect x="3.5" y="5" width="7.5" height="14" rx="1.5" />
      <rect x="13" y="5" width="7.5" height="14" rx="1.5" />
    </svg>
  );
}

export function IconGrid() {
  return (
    <svg {...base}>
      <rect x="4" y="4" width="6.6" height="6.6" rx="1" />
      <rect x="13.4" y="4" width="6.6" height="6.6" rx="1" />
      <rect x="4" y="13.4" width="6.6" height="6.6" rx="1" />
      <rect x="13.4" y="13.4" width="6.6" height="6.6" rx="1" />
    </svg>
  );
}

export function IconList() {
  return (
    <svg {...base}>
      <path d="M4 6.5h16M4 12h16M4 17.5h16" />
    </svg>
  );
}
