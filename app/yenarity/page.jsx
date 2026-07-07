import ArchivePage from "../../components/ArchivePage";

export const metadata = {
  title: "YENARITY 아카이브",
  description:
    "한국 라이프스타일 무드의 AI 버추얼 모델 예나리티(YENARITY) 아카이브 — 인물, 화보, 패션, 여행 이미지와 프롬프트.",
  alternates: { canonical: "/yenarity" },
  openGraph: {
    title: "YENARITY 아카이브 — yenarchivist",
    description: "AI 버추얼 모델 예나리티(YENARITY)의 화보·프롬프트 아카이브",
    url: "/yenarity",
  },
};

export default function YenarityPage() {
  return <ArchivePage initialProject="yenarity" />;
}
