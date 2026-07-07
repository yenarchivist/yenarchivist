import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FBF9F7",
          borderRadius: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontSize: 120,
            fontWeight: 800,
            color: "#2A2A2A",
            fontFamily: "Georgia, serif",
          }}
        >
          y
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 20,
              background: "#F4A7B9",
              marginLeft: 8,
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
