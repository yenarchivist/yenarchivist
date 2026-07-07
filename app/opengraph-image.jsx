import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "yenarchivist — 예나의 아카이브";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// 한글 렌더링용 폰트 — 실패하면 영문 전용 레이아웃으로 폴백
const FONT_URL =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/public/static/Pretendard-ExtraBold.otf";

export default async function OGImage() {
  let fontData = null;
  try {
    const res = await fetch(FONT_URL);
    if (res.ok) fontData = await res.arrayBuffer();
  } catch { /* 폰트 없이 진행 */ }

  const subtitle = fontData
    ? "예나의 아카이브 — 띵구 · 예나리티 · 프롬프트"
    : "personal archive — DINGU · YENARITY · prompts";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FBF9F7",
          padding: "64px 80px",
          fontFamily: fontData ? "Pretendard" : "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 22,
            letterSpacing: 6,
            color: "#B0B0B0",
            fontWeight: 800,
          }}
        >
          PERSONAL ARCHIVE
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              fontSize: 116,
              fontWeight: 800,
              color: "#2A2A2A",
              letterSpacing: -3,
            }}
          >
            yenarchivist
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 22,
                background: "#F4A7B9",
                marginLeft: 18,
              }}
            />
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 22,
                background: "#A7D8F0",
                marginLeft: 10,
              }}
            />
          </div>
          <div style={{ display: "flex", fontSize: 34, color: "#5B5854", marginTop: 18 }}>
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "2px solid rgba(42,42,42,0.12)",
            paddingTop: 28,
            fontSize: 24,
            color: "#8B8783",
          }}
        >
          <div style={{ display: "flex" }}>studio.yenament.com</div>
          <div style={{ display: "flex", letterSpacing: 4, fontWeight: 800 }}>
            DINGU × YENARITY
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [{ name: "Pretendard", data: fontData, weight: 800, style: "normal" }]
        : undefined,
    }
  );
}
