"use client";

import { useState, useEffect } from "react";
import { getAssets, createAsset, deleteAsset, updateAsset } from "../lib/appwrite";
import AssetCard from "./AssetCard";
import AddModal from "./AddModal";
import DetailModal from "./DetailModal";

const PROJECTS = [
  { id: "all", label: "전체", href: "/" },
  { id: "dingu", label: "DINGU", href: "/dingu" },
  { id: "yenarity", label: "YENARITY", href: "/yenarity" },
  { id: "github-mine", label: "My Repo", href: "/myrepo" },
  { id: "github-repo", label: "Good Repo", href: "/goodrepo" },
];

const TYPES = {
  all: ["image", "cardnews", "prompt", "video", "poster", "portrait", "fashion", "travel", "repo"],
  dingu: ["image", "cardnews", "prompt", "video", "poster"],
  yenarity: ["image", "portrait", "fashion", "travel", "prompt", "video"],
  "github-mine": ["repo"],
  "github-repo": ["repo"],
};

export default function ArchivePage({ initialProject = "all" }) {
  const [showAllTags, setShowAllTags] = useState(false);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeProject] = useState(initialProject);
  const [activeType, setActiveType] = useState("all");
  const [activeTags, setActiveTags] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [detailTarget, setDetailTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    fetchAssets();
  }, [activeProject, activeType]);

  async function fetchAssets() {
    setLoading(true);
    try {
      const filters = {};
      if (activeProject !== "all") filters.project = activeProject;
      if (activeType !== "all") filters.type = activeType;
      const data = await getAssets(filters);
      setAssets(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function handleSave(formData) {
    try {
      if (editTarget) {
        await updateAsset(editTarget.$id, formData);
      } else {
        await createAsset(formData);
      }
      setShowModal(false);
      setEditTarget(null);
      fetchAssets();
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDelete(id) {
    if (!confirm("삭제할까요?")) return;
    await deleteAsset(id);
    fetchAssets();
  }

  function handleEdit(asset) {
    setEditTarget(asset);
    setShowModal(true);
  }

  function toggleTag(tag) {
    setActiveTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  }

  const allTags = [...new Set(
    assets.flatMap((a) => a.tags ? a.tags.split(",").map((t) => t.trim()).filter(Boolean) : [])
  )].sort();

  const filtered = assets.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch = search
      ? a.title?.toLowerCase().includes(q) ||
        a.tags?.toLowerCase().includes(q) ||
        a.notes?.toLowerCase().includes(q) ||
        a.prompt?.toLowerCase().includes(q)
      : true;
    const matchTags = activeTags.length > 0
      ? activeTags.every((tag) => a.tags?.split(",").map((t) => t.trim()).includes(tag))
      : true;
    return matchSearch && matchTags;
  });

  const types = TYPES[activeProject] || TYPES.all;

  return (
    <main className="main">
      <header className="header">
        <div className="header-inner">
          <a href="/" className="logo" aria-label="yenarchivist home">
            <span className="logo-mark">y</span>
            <span className="logo-text">enarchivist</span>
          </a>
          <button className="add-btn" onClick={() => { setEditTarget(null); setShowModal(true); }}>
            + 추가
          </button>
        </div>

        <nav className="project-nav">
          {PROJECTS.map((p) => (
            <a key={p.id} href={p.href} className={`project-tab ${activeProject === p.id ? "active" : ""}`}>
              {p.label}
            </a>
          ))}
          <a href="/prompt-lab" className="project-tab nav-special">🧪 프롬프트 랩</a>
          <a href="/calendar" className="project-tab nav-special">📅 캘린더</a>
        </nav>
      </header>

      <div className="toolbar">
        <div className="type-filters">
          <button className={`type-btn ${activeType === "all" ? "active" : ""}`} onClick={() => setActiveType("all")}>전체</button>
          {types.map((t) => (
            <button key={t} className={`type-btn ${activeType === t ? "active" : ""}`} onClick={() => setActiveType(t)}>
              {t}
            </button>
          ))}
        </div>
        <div className="view-toggle" aria-label="보기 방식 선택">
          <button className={`view-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")}>격자</button>
          <button className={`view-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}>목록</button>
        </div>
        <input className="search-input" placeholder="제목, 태그, 프롬프트 검색..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {allTags.length > 0 && (
        <div className="tag-filter-bar">
          {(showAllTags ? allTags : allTags.slice(0, 8)).map((tag) => (
            <button key={tag} className={`tag-filter-btn ${activeTags.includes(tag) ? "active" : ""}`} onClick={() => toggleTag(tag)}>
              #{tag}
            </button>
          ))}
          {allTags.length > 8 && (
            <button className="tag-filter-btn" onClick={() => setShowAllTags((prev) => !prev)}>
              {showAllTags ? "접기 ↑" : `+${allTags.length - 8}개 더보기`}
            </button>
          )}
          {activeTags.length > 0 && (
            <button className="tag-clear-btn" onClick={() => setActiveTags([])}>초기화 ✕</button>
          )}
        </div>
      )}

      <div className="stats-bar">
        <span className="stat-item">{filtered.length}개</span>
        {activeTags.length > 0 && <span className="stat-item muted">태그: {activeTags.join(", ")}</span>}
      </div>

      {loading ? (
        <div className="loading">불러오는 중...</div>
      ) : filtered.length === 0 ? (
        <div className="empty">
          <p>아직 아무것도 없어요</p>
          <button className="add-btn-empty" onClick={() => setShowModal(true)}>+ 첫 번째 추가하기</button>
        </div>
      ) : (
        <div className={`grid ${viewMode === "list" ? "list-view" : ""}`}>
          {filtered.map((asset) => (
            <AssetCard key={asset.$id} asset={asset} onEdit={handleEdit} onDelete={handleDelete} onDetail={setDetailTarget} />
          ))}
        </div>
      )}

      {showModal && (
        <AddModal initial={editTarget} activeProject={activeProject} onSave={handleSave} onClose={() => { setShowModal(false); setEditTarget(null); }} />
      )}

      {detailTarget && (
        <DetailModal asset={detailTarget} onEdit={handleEdit} onClose={() => setDetailTarget(null)} />
      )}
    </main>
  );
}
