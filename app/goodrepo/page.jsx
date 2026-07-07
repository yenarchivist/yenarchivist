import ArchivePage from "../../components/ArchivePage";

export const metadata = {
  title: "Good Repo",
  description: "발견한 좋은 GitHub 저장소 레퍼런스 모음.",
  alternates: { canonical: "/goodrepo" },
  openGraph: { title: "Good Repo — yenarchivist", url: "/goodrepo" },
};

export default function GoodRepoPage() {
  return <ArchivePage initialProject="github-repo" />;
}
