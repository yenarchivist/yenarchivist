import ArchivePage from "../../components/ArchivePage";

export const metadata = {
  title: "DINGU 아카이브",
  description:
    "게으르지만 효율에 집착하는 보더콜리 CEO 띵구(DINGU)의 콘텐츠 아카이브 — 이미지, 카드뉴스, 포스터, 영상, 프롬프트.",
  alternates: { canonical: "/dingu" },
  openGraph: {
    title: "DINGU 아카이브 — yenarchivist",
    description: "보더콜리 CEO 띵구(DINGU)의 콘텐츠 아카이브",
    url: "/dingu",
  },
};

export default function DinguPage() {
  return <ArchivePage initialProject="dingu" />;
}
