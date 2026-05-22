export async function fetchGithubRepo(url) {
  try {
    // URL에서 owner/repo 추출
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return null;

    const owner = match[1];
    const repo = match[2].replace(/\.git$/, "");

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    if (!res.ok) return null;

    const data = await res.json();

    return {
      title: data.full_name,
      notes: data.description || "",
      image_url: data.html_url,
      tool: data.language || "GitHub",
      tags: data.topics?.join(", ") || "",
      rating: Math.min(5, Math.floor(data.stargazers_count / 1000)),
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}