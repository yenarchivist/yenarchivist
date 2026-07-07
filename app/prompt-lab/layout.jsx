import './prompt-lab.css';

// 외부(Reactor Prompt) 콘텐츠 미러 성격이라 검색엔진에서 제외 — 중복 콘텐츠 페널티 방지
export const metadata = {
  title: "프롬프트 랩",
  description: "외부 프롬프트를 분석하고 예나리티 감각으로 리믹스하는 실험실.",
  robots: { index: false, follow: false },
};

export default function PromptLabLayout({ children }) {
  return children;
}
