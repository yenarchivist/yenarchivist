"use client";
import { useState, useEffect } from "react";
import { fetchGithubRepo } from "../lib/github";

const PROJECT_OPTIONS = ["dingu", "yenarity", "github-mine", "github-repo"];
const TYPE_OPTIONS = ["image", "portrait", "fashion", "travel", "cardnews", "prompt", "video", "poster", "repo"];
const STATUS_OPTIONS = ["test", "useful", "favorite", "deprecated"];
const TOOL_OPTIONS = ["ChatGPT", "Midjourney", "Claude", "Gemini", "Runway", "Kling", "Sora", "GitHub", "기타"];

export default function AddModal({ initial, activeProject, onSave, onClose }) {
  const [githubLoading, setGithubLoading] = useState(false);

  async function handleGithubFetch() {
    if (!form.image_url) return;
    setGithubLoading(true);
    const data = await fetchGithubRepo(form.image_url);
    if (data) setForm({ ...form, ...data });
    setGithubLoading(false);
  }
  
  const [form, setForm] = useState({
    title: "",
    project: activeProject !== "all" ? activeProject : "dingu",
    type: "image",
    image_url: "",
    threads_url: "",
    prompt: "",
    tool: "",
    tags: "",
    status: "test",
    notes: "",
    rating: 0,
  });

  useEffect(() => {
    if (initial) setForm({ ...form, ...initial });
  }, [initial]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const data = { ...form, rating: Number(form.rating) };
    // threads_url 속성이 Appwrite 컬렉션에 없어도 저장이 깨지지 않도록 빈 값은 제거
    if (!data.threads_url) delete data.threads_url;
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
          <h2>{initial ? "수정" : "새 아이템 추가"}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <label>제목 *</label>
            <input name="title" value={form.title} onChange={handleChange} required placeholder="제목 입력" />
          </div>

          <div className="form-row-2">
            <div className="form-row">
              <label>프로젝트</label>
              <select name="project" value={form.project} onChange={handleChange}>
                {PROJECT_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label>타입</label>
              <select name="type" value={form.type} onChange={handleChange}>
                {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <label>이미지 URL (한 줄에 하나씩, 여러 장 가능)</label>
            <textarea
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              rows={3}
              placeholder={"https://...R2/이미지1.jpg\nhttps://...R2/이미지2.jpg\n(repo 타입은 GitHub URL 한 줄)"}
            />
            <button type="button" className="btn-cancel" style={{ alignSelf: "flex-start" }} onClick={handleGithubFetch} disabled={githubLoading}>
              {githubLoading ? "..." : "GitHub 정보 가져오기"}
            </button>
          </div>

          <div className="form-row">
            <label>Threads 링크 (선택)</label>
            <input name="threads_url" value={form.threads_url || ""} onChange={handleChange} placeholder="https://www.threads.com/@.../post/..." />
          </div>

          <div className="form-row">
            <label>프롬프트</label>
            <textarea name="prompt" value={form.prompt} onChange={handleChange} rows={4} placeholder="사용한 프롬프트 입력" />
          </div>

          <div className="form-row-2">
            <div className="form-row">
              <label>도구</label>
              <select name="tool" value={form.tool} onChange={handleChange}>
                <option value="">선택</option>
                {TOOL_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label>상태</label>
              <select name="status" value={form.status} onChange={handleChange}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <label>태그</label>
            <input name="tags" value={form.tags} onChange={handleChange} placeholder="쉼표로 구분: portrait, fashion, seoul" />
          </div>

          <div className="form-row">
            <label>메모</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="자유 메모" />
          </div>

          <div className="form-row">
            <label>별점 (0-5)</label>
            <input name="rating" type="number" min="0" max="5" value={form.rating} onChange={handleChange} />
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
