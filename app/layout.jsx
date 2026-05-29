import "./globals.css";
import "./archive.css";

export const metadata = {
  title: "yenarchivist",
  description: "예나의 개인 아카이브 — 띵구, 예나리티, GitHub, 레퍼런스",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
