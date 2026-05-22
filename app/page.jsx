"use client";
import { useState, useEffect } from "react";
import { getAssets, createAsset, deleteAsset, updateAsset } from "../lib/appwrite";
import AssetCard from "../components/AssetCard";
import AddModal from "../components/AddModal";

const PROJECTS = [
  { id: "all", label: "전체" },
  { id: "dingu", label: "🐾 띵구" },
  { id: "yenarity", label: "✦ 예나리티" },
  { id: "github-mine", label: "⌥ 내 GitHub" },
  { id: "github-repo", label: "★ 좋은 Repo" },
];

const TYPES = {
  all: ["전체"],
  dingu: ["image", "cardnews", "prompt", "video", "poster"],
  yenarity: ["image", "portrait", "fashion", "travel", "prompt", "video"],
  "github-mine": ["repo"],
  "github-repo": ["repo"],
};

export default function Home() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeProject, setActiveProject] = useState("all");
  const [activeType, setActiveType] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [search, setSearch] = useState("");

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

  const filtered = assets.filter((a) =>
    search
      ? a.title?.toLowerCase().includes(search.toLowerCase()) ||
        a.tags?.toLowerCase().includes(search.toLowerCase()) ||
        a.notes?.toLowerCase().includes(search.toLowerCase())
      : true
  );

  const types = TYPES[activeProject] || TYPES.all;

  return (
    <main className="main">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-mark">y</span>
            <span className="logo-text">enarchivist</span>
          </div>
          <button className="add-btn" onClick={() => { setEditTarget(null); setShowModal(true); }}>
            + 추가
          </button>
        </div>

        <nav className="project-nav">
          {PROJECTS.map((p) => (
            <button
              key={p.id}
              className={`project-tab ${activeProject === p.id ? "active" : ""}`}
              onClick={() => { setActiveProject(p.id); setActiveType("all"); }}
            >
              {p.label}
            </button>
          ))}
        </nav>
      </header>

      <div className="toolbar">
        <div className="type-filters">
          {["all", ...types.filter(t => t !== "전체")].map((t) => (
            <button
              key={t}
              className={`type-btn ${activeType === t ? "active" : ""}`}
              onClick={() => setActiveType(t)}
            >
              {t === "all" ? "전체" : t}
            </button>
          ))}
        </div>
        <input
          className="search-input"
          placeholder="검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="stats-bar">
        <span className="stat-item">{filtered.length}개</span>
        {activeProject !== "all" && (
          <span className="stat-item muted">{PROJECTS.find(p => p.id === activeProject)?.label}</span>
        )}
      </div>

      {loading ? (
        <div className="loading">불러오는 중...</div>
      ) : filtered.length === 0 ? (
        <div className="empty">
          <p>아직 아무것도 없어요</p>
          <button className="add-btn-empty" onClick={() => setShowModal(true)}>+ 첫 번째 추가하기</button>
        </div>
      ) : (
        <div className="grid">
          {filtered.map((asset) => (
            <AssetCard
              key={asset.$id}
              asset={asset}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
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
    </main>
  );
}
