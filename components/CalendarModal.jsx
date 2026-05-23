"use client";
import { useState, useEffect } from "react";

const PROJECT_OPTIONS = ["dingu", "yenarity", "github-mine", "github-repo", "etc"];
const TYPE_OPTIONS = ["content", "repo", "app", "note"];
const STATUS_OPTIONS = ["아이디어", "진행중", "완료"];
const PLATFORM_OPTIONS = ["instagram", "threads", "x", "youtube", "github", "blog", "mac", "etc"];

export default function CalendarModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState({
    title: "",
    type: "content",
    project: "dingu",
    platform: "instagram",
    status: "아이디어",
    publish_at: new Date().toISOString().slice(0, 10),
    url: null,
    notes: "",
  });

  useEffect(() => {
    if (initial) setForm({ ...form, ...initial });
  }, [initial]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const data = { ...form };
    if (!data.url) delete data.url;
    delete data.$id;
    delete data.$createdAt;
    delete data.$updatedAt;
    delete data.$collectionId;
    delete data.$databaseId;
    delete data.$permissions;
    onSave(data);
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{initial ? "일정 수정" : "새 일정 추가"}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <label>제목 *</label>
            <input name="title" value={form.title} onChange={handleChange} required placeholder="일정 제목" />
          </div>

          <div className="form-row-2">
            <div className="form-row">
              <label>날짜</label>
              <input name="publish_at" type="datetime-local" value={form.publish_at} onChange={handleChange} />
            </div>
            <div className="form-row">
              <label>상태</label>
              <select name="status" value={form.status} onChange={handleChange}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-row">
              <label>프로젝트</label>
              <select name="project" value={form.project} onChange={handleChange}>
                {PROJECT_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label>플랫폼</label>
              <select name="platform" value={form.platform} onChange={handleChange}>
                {PLATFORM_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <label>타입</label>
            <select name="type" value={form.type} onChange={handleChange}>
              {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="form-row">
            <label>URL</label>
            <input name="url" value={form.url} onChange={handleChange} placeholder="관련 링크" />
          </div>

          <div className="form-row">
            <label>메모</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="자유 메모" />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>취소</button>
            <button type="submit" className="btn-save">{initial ? "저장" : "추가"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}