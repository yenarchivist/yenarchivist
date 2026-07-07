import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import "./archive.css";

const SITE_URL = "https://studio.yenament.com";
const SITE_TITLE = "yenarchivist — 예나의 아카이브";
const SITE_DESC =
  "AI 이미지·프롬프트·레퍼런스를 모으는 예나의 개인 아카이브. 게으르지만 효율에 집착하는 보더콜리 CEO 띵구(DINGU)와 AI 모델 예나리티(YENARITY)의 작업 기록.";

// 트래킹 ID — Vercel 환경변수에 넣으면 자동으로 활성화됨 (.env.example 참고)
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — yenarchivist",
  },
  description: SITE_DESC,
  keywords: [
    "yenarchivist", "yenament", "예나리티", "YENARITY", "띵구", "DINGU",
    "AI 이미지", "AI 프롬프트", "프롬프트 아카이브", "이미지 아카이브",
  ],
  authors: [{ name: "yena", url: SITE_URL }],
  creator: "yena",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: "yenarchivist",
    title: SITE_TITLE,
    description: SITE_DESC,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION
      ? { "naver-site-verification": process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION }
      : undefined,
  },
};

export const viewport = {
  themeColor: "#FBF9F7",
  width: "device-width",
  initialScale: 1,
};

// GEO(생성형 검색) 대응 — 사이트 정체를 구조화 데이터로 명시
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "yenarchivist",
  alternateName: ["예나 아카이브", "yenament studio"],
  url: SITE_URL,
  description: SITE_DESC,
  inLanguage: "ko",
  author: { "@type": "Person", name: "yena", url: SITE_URL },
  about: [
    { "@type": "Thing", name: "DINGU", description: "게으르지만 효율에 집착하는 보더콜리 CEO 캐릭터" },
    { "@type": "Thing", name: "YENARITY", description: "한국 라이프스타일 무드의 AI 버추얼 모델" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        {children}
        <Analytics />
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
        {CLARITY_ID && (
          <Script id="clarity-init" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`}
          </Script>
        )}
      </body>
    </html>
  );
}
