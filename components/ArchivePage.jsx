"use client";

import { useState, useEffect, useMemo } from "react";
import { getAssets, createAsset, deleteAsset, updateAsset } from "../lib/appwrite";
import { normalizeAsset } from "../lib/normalize";
import AssetCard from "./AssetCard";
import AddModal from "./AddModal";
import Lightbox from "./Lightbox";
import CompareModal from "./CompareModal";
import { IconHeart, IconGrid, IconList, IconClose } from "./icons";

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

const LIKES_KEY = "yenarchivist:likes";
const VIEW_KEY = "yenarchivist:view";
const MAX_COMPARE = 3;

export default function ArchivePage({ initialProject = "all" }) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeProject] = useState(initialProject);
  const [activeType, setActiveType] = useState("all");
  const [activeTags, setActiveTags] = useState([]);
  const [showAllTags, setShowAllTags] = useState(false);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [likes, setLikes] = useState({});
  const [onlyLiked, setOnlyLiked] = useState(false);
  const [compare, setCompare] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [detailTarget, setDetailTarget] = useState(null);

  useEffect(() => {
    try {
      setLikes(JSON.parse(localStorage.getItem(LIKES_KEY) || "{}"));
      const v = localStorage.getItem(VIEW_KEY);
      if (v === "grid" || v === "list") setViewMode(v);
    } catch { /* noop */ }
  }, []);

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
      setAssets(data.map(normalizeAsset));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  function setView(mode) {
    setViewMode(mode);
    try { localStorage.setItem(VIEW_KEY, mode); } catch { /* noop */ }
  }

  function toggleLike(id) {
    setLikes((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = true;
      try { localStorage.setItem(LIKES_KEY, JSON.stringify(next)); } catch { /* noop */ }
      return next;
    });
  }

  function toggleCompare(asset) {
    setCompare((prev) => {
      if (prev.some((a) => a.id === asset.id)) return prev.filter((a) => a.id !== asset.id);
      const next = [...prev, asset];
      return next.length > MAX_COMPARE ? next.slice(next.length - MAX_COMPARE) : next;
    });
  }

  function removeFromCompare(id) {
    setCompare((prev) => {
      const next = prev.filter((a) => a.id !== id);
      if (next.length === 0) setShowCompare(false);
      return next;
    });
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
      setDetailTarget(null);
      fetchAssets();
    } catch (e) {
      console.error(e);
      alert("저장에 실패했어요. Appwrite 권한/필드를 확인해주세요.");
    }
  }

  async function handleDelete(id) {
    if (!confirm("삭제할까요?")) return;
    await deleteAsset(id);
    setDetailTarget(null);
    setCompare((prev) => prev.filter((a) => a.id !== id));
    fetchAssets();
  }

  function handleEdit(rawDoc) {
    setEditTarget(rawDoc);
    setShowModal(true);
    setDetailTarget(null);
  }

  function toggleTag(tag) {
    setActiveTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  }

  const allTags = useMemo(
    () => [...new Set(assets.flatMap((a) => a.tags))].sort(),
    [assets]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return assets.filter((a) => {
      if (onlyLiked && !likes[a.id]) return false;
      const matchSearch = q
        ? [a.title, a.tags.join(" "), a.notes, a.prompt].join(" ").toLowerCase().includes(q)
        : true;
      const matchTags = activeTags.length > 0
        ? activeTags.every((tag) => a.tags.includes(tag))
        : true;
      return matchSearch && matchTags;
    });
  }, [assets, search, activeTags, onlyLiked, likes]);

  const types = TYPES[activeProject] || TYPES.all;

  return (
    <main className="main" data-project={activeProject}>
      <header className="header">
        <div className="header-inner">
          <a href="/" className="logo" aria-label="yenarchivist home">
            <span className="logo-mark">y</span>
            <span className="logo-text">enarchivist</span>
            <span className="logo-dot" />
          </a>
          <button className="add-btn" onClick={() => { setEditTarget(null); setShowModal(true); }}>
            + 추가
          </button>
        </div>

        <nav className="project-nav">
          {PROJECTS.map((p) => (
            <a
              key={p.id}
              href={p.href}
              data-proj={p.id}
              className={`project-tab ${activeProject === p.id ? "active" : ""}`}
            >
              {p.label}
            </a>
          ))}
          <span className="nav-divider" aria-hidden />
          <a href="/prompt-lab" className="project-tab nav-special">프롬프트 랩</a>
          <a href="/calendar" className="project-tab nav-special">캘린더</a>
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

        <div className="toolbar-right">
          <button
            className={`like-filter ${onlyLiked ? "on" : ""}`}
            aria-label="좋아요만 보기"
            title="좋아요만 보기"
            onClick={() => setOnlyLiked((v) => !v)}
          >
            <IconHeart filled={onlyLiked} />
          </button>
          <div className="view-toggle" role="group" aria-label="보기 방식 선택">
            <button className={`view-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setView("grid")}>
              <IconGrid /> 격자
            </button>
            <button className={`view-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setView("list")}>
              <IconList /> 목록
            </button>
          </div>
          <input
            className="search-input"
            placeholder="제목, 태그, 프롬프트 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="tag-filter-bar">
          {(showAllTags ? allTags : allTags.slice(0, 8)).map((tag) => (
            <button key={tag} className={`tag-filter-btn ${activeTags.includes(tag) ? "active" : ""}`} onClick={() => toggleTag(tag)}>
              #{tag}
            </button>
          ))}
          {allTags.length > 8 && (
            <button className="tag-filter-btn more" onClick={() => setShowAllTags((prev) => !prev)}>
              {showAllTags ? "접기 ↑" : `+${allTags.length - 8}`}
            </button>
          )}
          {activeTags.length > 0 && (
            <button className="tag-clear-btn" onClick={() => setActiveTags([])}>초기화 ✕</button>
          )}
        </div>
      )}

      <div className="stats-bar">
        <span className="stat-item">{filtered.length} ITEMS</span>
        {onlyLiked && <span className="stat-item accent">LIKED ONLY</span>}
        {activeTags.length > 0 && <span className="stat-item muted">#{activeTags.join("  #")}</span>}
      </div>

      {loading ? (
        <div className="loading"><span className="loading-pulse" />불러오는 중</div>
      ) : filtered.length === 0 ? (
        <div className="empty">
          <p className="empty-mark">∅</p>
          <p>{onlyLiked ? "좋아요한 항목이 없어요" : "아직 아무것도 없어요"}</p>
          {!onlyLiked && (
            <button className="add-btn-empty" onClick={() => setShowModal(true)}>+ 첫 번째 추가하기</button>
          )}
        </div>
      ) : (
        <div key={viewMode} className={`grid ${viewMode === "list" ? "list-view" : ""}`}>
          {filtered.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              liked={!!likes[asset.id]}
              onLike={toggleLike}
              onOpen={setDetailTarget}
            />
          ))}
        </div>
      )}

      {compare.length > 0 && !showCompare && (
        <div className="compare-tray">
          <span className="compare-thumbs">
            {compare.map((a) => (
              a.images[0]
                ? <img key={a.id} src={a.images[0]} alt={a.title} />
                : <span key={a.id} className="compare-thumb-ph">📎</span>
            ))}
          </span>
          <button className="compare-open" onClick={() => setShowCompare(true)}>
            비교하기 ({compare.length})
          </button>
          <button className="compare-clear" aria-label="비교 목록 비우기" onClick={() => setCompare([])}>
            <IconClose />
          </button>
        </div>
      )}

      {showModal && (
        <AddModal
          initial={editTarget}
          activeProject={activeProject}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditTarget(null); }}
        />
      )}

      {detailTarget && (
        <Lightbox
          asset={detailTarget}
          liked={!!likes[detailTarget.id]}
          onLike={toggleLike}
          inCompare={compare.some((a) => a.id === detailTarget.id)}
          onToggleCompare={toggleCompare}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onClose={() => setDetailTarget(null)}
        />
      )}

      {showCompare && (
        <CompareModal
          items={compare}
          onRemove={removeFromCompare}
          onClose={() => setShowCompare(false)}
        />
      )}
    </main>
  );
}
