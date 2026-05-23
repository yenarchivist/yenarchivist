"use client";
import { useState, useEffect } from "react";
import { getCalendarItems, createCalendarItem, updateCalendarItem, deleteCalendarItem } from "../../lib/appwrite";
import CalendarModal from "../../components/CalendarModal";

const STATUS_COLORS = {
  "아이디어": { bg: "#f3f4f6", color: "#6b7280" },
  "진행중": { bg: "#dbeafe", color: "#1e40af" },
  "완료": { bg: "#d1fae5", color: "#065f46" },
};

const PLATFORM_EMOJI = {
  instagram: "📸", threads: "🧵", x: "✕", youtube: "▶️",
  github: "⌥", blog: "✍️", mac: "🖥️", etc: "📌",
};

const PROJECT_LABELS = {
  dingu: "🐾 띵구",
  yenarity: "✦ 예나리티",
  "github-mine": "⌥ 내 GitHub",
  "github-repo": "★ 좋은 Repo",
  etc: "📌 기타",
};

export default function CalendarPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [filterStatus, setFilterStatus] = useState("전체");

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    setLoading(true);
    try {
      const data = await getCalendarItems();
      setItems(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function handleSave(formData) {
    try {
      if (editTarget) {
        await updateCalendarItem(editTarget.$id, formData);
      } else {
        await createCalendarItem(formData);
      }
      setShowModal(false);
      setEditTarget(null);
      fetchItems();
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDelete(id) {
    if (!confirm("삭제할까요?")) return;
    await deleteCalendarItem(id);
    fetchItems();
  }

  function handleEdit(item) {
    setEditTarget(item);
    setShowModal(true);
  }

  const filtered = filterStatus === "전체"
    ? items
    : items.filter(i => i.status === filterStatus);

  // 날짜별 그룹핑
  const grouped = filtered.reduce((acc, item) => {
    const date = item.publish_at || "날짜 없음";
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

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

        <a href="/calendar" className="project-tab" style={{ marginLeft: "auto" }}>📅 캘린더</a>
        
        <nav className="project-nav">
          <a href="/" className="project-tab">전체</a>
          <a href="/calendar" className="project-tab active">📅 캘린더</a>
        </nav>
      </header>

      <div className="toolbar">
        <div className="type-filters">
          {["전체", "아이디어", "진행중", "완료"].map(s => (
            <button
              key={s}
              className={`type-btn ${filterStatus === s ? "active" : ""}`}
              onClick={() => setFilterStatus(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="stats-bar">
        <span className="stat-item">{filtered.length}개</span>
      </div>

      {loading ? (
        <div className="loading">불러오는 중...</div>
      ) : filtered.length === 0 ? (
        <div className="empty">
          <p>일정이 없어요</p>
          <button className="add-btn-empty" onClick={() => setShowModal(true)}>+ 첫 일정 추가하기</button>
        </div>
      ) : (
        <div className="calendar-list">
          {Object.entries(grouped).sort().map(([date, dayItems]) => (
            <div key={date} className="calendar-day">
              <div className="calendar-date-header">{date}</div>
              {dayItems.map(item => {
                const status = STATUS_COLORS[item.status] || STATUS_COLORS["아이디어"];
                const emoji = PLATFORM_EMOJI[item.platform] || "📌";
                return (
                  <div key={item.$id} className="calendar-item">
                    <div className="calendar-item-left">
                      <span className="calendar-emoji">{emoji}</span>
                      <div className="calendar-item-info">
                        <div className="calendar-item-title">{item.title}</div>
                        <div className="calendar-item-meta">
                          {PROJECT_LABELS[item.project] || item.project}
                          {item.platform && ` · ${item.platform}`}
                        </div>
                        {item.notes && <div className="calendar-item-notes">{item.notes}</div>}
                      </div>
                    </div>
                    <div className="calendar-item-right">
                      <span className="calendar-status" style={{ background: status.bg, color: status.color }}>
                        {item.status}
                      </span>
                      <div className="calendar-actions">
                        <button className="action-btn" onClick={() => handleEdit(item)}>수정</button>
                        <button className="action-btn danger" onClick={() => handleDelete(item.$id)}>삭제</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <CalendarModal
          initial={editTarget}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditTarget(null); }}
        />
      )}
    </main>
  );
}