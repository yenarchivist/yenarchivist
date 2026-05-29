"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function pickAnalysis(prompt) {
  const text = (prompt || "").toLowerCase();
  const fields = {
    style: [], lighting: [], camera: [], mood: [], composition: [], motion: []
  };
  const rules = [
    ["style", "cinematic", "cinematic"], ["style", "photoreal", "photoreal"], ["style", "editorial", "editorial"], ["style", "luxury", "luxury"],
    ["lighting", "daylight", "daylight"], ["lighting", "warm", "warm light"], ["lighting", "soft", "soft light"],
    ["camera", "close-up", "close-up"], ["camera", "35mm", "35mm"], ["camera", "dynamic camera", "dynamic camera"],
    ["mood", "quiet", "quiet"], ["mood", "confidence", "confident"], ["mood", "blockbuster", "blockbuster"],
    ["composition", "extreme close-up", "extreme close-up"], ["composition", "elegant composition", "elegant composition"],
    ["motion", "motion blur", "motion blur"], ["motion", "transforms", "transformation"], ["motion", "walking", "walking"]
  ];
  rules.forEach(([key, needle, label]) => {
    if (text.includes(needle) && !fields[key].includes(label)) fields[key].push(label);
  });
  return fields;
}

function buildYenarityRemix(seed) {
  const tags = seed?.tags?.filter((tag) => tag !== "reactor").join(", ") || "editorial, portrait, lifestyle";
  return `Create a refined Yenarity visual prompt inspired by: ${seed?.title || "selected reference"}. Use a Korean virtual lifestyle model with a consistent short bob identity, quiet luxury mood, clean modern composition, soft natural lighting, premium hotel/cafe/travel editorial atmosphere, beige-neutral palette, subtle confidence, realistic texture, and polished commercial finish. Preserve the useful visual structure from the reference (${tags}), but reinterpret it as Yenarity's own lifestyle archive image.`;
}

function imageSources(post) {
  if (!post) return [];
  return Array.from(new Set([post.thumbnail, ...(post.images || [])].filter(Boolean)));
}

function SafeImage({ sources, alt }) {
  const list = useMemo(() => Array.from(new Set((sources || []).filter(Boolean))), [sources]);
  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [list.join("|")]);
  if (!list.length || index >= list.length) return <div className="lab-image-fallback">No preview</div>;
  const props = { src: list[index], alt: alt || "prompt image", loading: "lazy" };
  props["on" + "Error"] = () => setIndex((value) => value + 1);
  return <img {...props} />;
}

export default function PromptLab() {
  const [posts, setPosts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("all");
  const [selected, setSelected] = useState(null);
  const [slide, setSlide] = useState(0);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/api/reactor")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts || []);
        setMeta(data.meta || null);
      })
      .catch(() => {
        setPosts([]);
        setMeta(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const allTags = useMemo(() => ["all", ...Array.from(new Set(posts.flatMap((post) => post.tags || []))).sort()], [posts]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      const tagOk = activeTag === "all" || post.tags?.includes(activeTag);
      const qOk = !q || [post.title, post.caption, post.prompt, post.source, ...(post.tags || [])].filter(Boolean).join(" ").toLowerCase().includes(q);
      return tagOk && qOk;
    });
  }, [posts, query, activeTag]);

  function openPost(post) {
    setSelected(post);
    setSlide(0);
    setCopied("");
  }

  async function copyText(text, key) {
    await navigator.clipboard.writeText(text || "");
    setCopied(key);
    setTimeout(() => setCopied(""), 1400);
  }

  const analysis = selected ? pickAnalysis(selected.prompt) : null;
  const images = selected ? imageSources(selected) : [];
  const remix = selected ? buildYenarityRemix(selected) : "";

  return (
    <main className="prompt-lab-page">
      <header className="lab-hero">
        <div>
          <div className="lab-topline">
            <Link href="/" className="lab-back">← yenarchivist</Link>
            <span>프롬프트 랩</span>
          </div>
          <h1>외부 프롬프트를 보고, 분석하고, 예나리티 감각으로 바꾸는 실험실</h1>
          <p>Reactor Prompt 데이터를 실시간으로 읽어오고, 프롬프트가 있는 레퍼런스만 보여줘. 마음에 드는 건 나중에 본진 자산으로 저장하게 만들 거야.</p>
        </div>
        <div className="lab-stat-card">
          <strong>{loading ? "..." : posts.length}</strong>
          <span>prompt refs</span>
          {meta && <small>{meta.totalSourcePosts} posts · {meta.skippedWithoutPrompt} skipped</small>}
        </div>
      </header>

      <section className="lab-controls">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="검색: hotel, kimono, cinematic, food, poster..." />
        <div className="lab-tags">
          {allTags.map((tag) => (
            <button key={tag} className={activeTag === tag ? "active" : ""} onClick={() => setActiveTag(tag)}>#{tag}</button>
          ))}
        </div>
      </section>

      {loading ? <div className="lab-loading">Reactor 데이터를 불러오는 중...</div> : (
        <section className="lab-grid">
          {filtered.map((post) => (
            <article key={post.id} className="lab-card" onClick={() => openPost(post)}>
              <div className="lab-thumb"><SafeImage sources={imageSources(post)} alt={post.title} /></div>
              <div className="lab-card-body">
                <div className="lab-meta"><span>{post.source}</span><span>{post.date}</span></div>
                <h2>{post.title}</h2>
                <p>{post.caption || post.prompt}</p>
                <div className="lab-card-tags">{(post.tags || []).slice(0, 5).map((tag) => <span key={tag}>#{tag}</span>)}</div>
              </div>
            </article>
          ))}
        </section>
      )}

      {selected && (
        <div className="lab-modal-overlay" onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
          <div className="lab-modal">
            <button className="lab-close" onClick={() => setSelected(null)}>×</button>
            <div className="lab-modal-media">
              {images.length ? <img src={images[slide]} alt={selected.title} /> : <div className="lab-image-fallback">No image</div>}
              {images.length > 1 && <div className="lab-slide-nav"><button onClick={() => setSlide((slide - 1 + images.length) % images.length)}>‹</button><span>{slide + 1} / {images.length}</span><button onClick={() => setSlide((slide + 1) % images.length)}>›</button></div>}
            </div>
            <div className="lab-modal-body">
              <p className="lab-eyebrow">{selected.source}</p>
              <h2>{selected.title}</h2>
              <p className="lab-caption">{selected.caption}</p>
              <div className="lab-card-tags lab-detail-tags">{(selected.tags || []).map((tag) => <span key={tag}>#{tag}</span>)}</div>

              <div className="lab-section-title">Original Prompt</div>
              <pre className="lab-prompt-box">{selected.prompt}</pre>
              <div className="lab-actions">
                <button onClick={() => copyText(selected.prompt, "original")}>{copied === "original" ? "복사됨!" : "원본 프롬프트 복사"}</button>
                {selected.threadsUrl && <a href={selected.threadsUrl} target="_blank">원본 보기</a>}
              </div>

              <div className="lab-section-title">Quick Analysis</div>
              <div className="lab-analysis-grid">
                {Object.entries(analysis).map(([key, values]) => <div key={key} className="lab-analysis-card"><b>{key}</b><p>{values.length ? values.join(", ") : "아직 자동 감지 없음"}</p></div>)}
              </div>

              <div className="lab-section-title">Yenarity Remix Starter</div>
              <pre className="lab-prompt-box lab-remix">{remix}</pre>
              <div className="lab-actions"><button onClick={() => copyText(remix, "remix")}>{copied === "remix" ? "복사됨!" : "예나리티 프롬프트 복사"}</button><button disabled className="lab-disabled">내 자산으로 저장 예정</button></div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
