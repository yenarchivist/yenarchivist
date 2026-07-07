// Appwrite 문서 → 화면용 통합 스키마
// { id, no, title, date, dateDisplay, tags[], images[], prompt, threadsUrl, link, ... }
//
// 이미지: image_url 필드에 줄바꿈(또는 쉼표)으로 구분해 여러 URL 저장 가능.
//   Cloudflare R2 등 어디에 올렸든 공개 URL이면 그대로 렌더링됨.
// threadsUrl: threads_url 속성이 있으면 사용, 없으면 notes 안의 Threads 링크 자동 추출.

const THREADS_RE = /https?:\/\/(?:www\.)?threads\.(?:net|com)\/[^\s"'<>)\]]+/i;

export function splitList(str) {
  if (!str) return [];
  return str.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
}

export function formatDate(d) {
  if (!d) return "";
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function normalizeAsset(doc) {
  const urls = splitList(doc.image_url || "");
  const isRepo = doc.type === "repo" || (doc.project || "").startsWith("github");
  const images = isRepo ? [] : urls;
  const link = isRepo ? urls[0] || "" : "";
  const threadsUrl = doc.threads_url || (doc.notes || "").match(THREADS_RE)?.[0] || "";
  const created = doc.$createdAt ? new Date(doc.$createdAt) : null;

  return {
    id: doc.$id,
    no: (doc.$id || "").slice(-4).toUpperCase(),
    title: doc.title || "제목 없음",
    date: created,
    dateDisplay: formatDate(created),
    tags: splitList(doc.tags),
    images,
    link,
    prompt: doc.prompt || "",
    threadsUrl,
    project: doc.project || "",
    type: doc.type || "",
    status: doc.status || "",
    tool: doc.tool || "",
    notes: doc.notes || "",
    rating: doc.rating || 0,
    raw: doc,
  };
}
