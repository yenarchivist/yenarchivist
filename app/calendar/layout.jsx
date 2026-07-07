// 캘린더는 개인 발행 스케줄이라 검색엔진에서 제외
export const metadata = {
  title: "발행 캘린더",
  description: "콘텐츠 발행 스케줄 관리.",
  robots: { index: false, follow: false },
};

export default function CalendarLayout({ children }) {
  return children;
}
