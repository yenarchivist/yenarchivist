import ArchivePage from "../../components/ArchivePage";

export const metadata = {
  title: "My Repo",
  description: "직접 만든 GitHub 저장소 모음.",
  alternates: { canonical: "/myrepo" },
  openGraph: { title: "My Repo — yenarchivist", url: "/myrepo" },
};

export default function MyRepoPage() {
  return <ArchivePage initialProject="github-mine" />;
}
