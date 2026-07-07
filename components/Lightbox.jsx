"use client";

import { useEffect, useRef, useState } from "react";
import {
  IconHeart, IconDownload, IconClose, IconCopy, IconCheck,
  IconArrow, IconExternal, IconCompare,
} from "./icons";

const PROJECT_LABELS = {
  dingu: "🐾 DINGU",
  yenarity: "✦ YENARITY",
  "github-mine": "⌥ My Repo",
  "github-repo": "★ Good Repo",
};

export default function Lightbox({
  asset, liked, onLike, inCompare, onToggleCompare, onEdit, onDelete, onClose,
}) {
  const [slide, setSlide] = useState(0);
  const [copied, setCopied] = useState(false);
  const touchX = useRef(null);
  const n = asset.images.length;

  useEffect(() => {
    setSlide(0);
    setCopied(false);
  }, [asset.id]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && n > 1) setSlide((s) => (s - 1 + n) % n);
      if (e.key === "ArrowRight" && n > 1) setSlide((s) => (s + 1) % n);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [n, onClose]);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(asset.prompt || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard 미지원 브라우저 */ }
  }

  async function downloadImage() {
    const url = asset.images[slide];
    if (!url) return;
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${asset.no}-${slide + 1}${blob.type.includes("png") ? ".png" : ".jpg"}`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      window.open(url, "_blank", "noopener");
    }
  }

  function onTouchStart(e) { touchX.current = e.touches[0].clientX; }
  function onTouchEnd(e) {
    if (touchX.current == null || n < 2) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (dx > 48) setSlide((s) => (s - 1 + n) % n);
    if (dx < -48) setSlide((s) => (s + 1) % n);
    touchX.current = null;
  }

  return (
    <div className="lb-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="lb-container" data-proj={asset.project}>
        <div className="lb-stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          {n > 0 ? (
            <img key={slide} src={asset.images[slide]} alt={`${asset.title} ${slide + 1}`} className="lb-img" />
          ) : (
            <div className="lb-noimg">이미지 없음</div>
          )}

          {n > 1 && (
            <>
              <button className="lb-arrow lb-arrow-l" aria-label="이전 이미지" onClick={() => setSlide((s) => (s - 1 + n) % n)}>
                <IconArrow dir="left" />
              </button>
              <button className="lb-arrow lb-arrow-r" aria-label="다음 이미지" onClick={() => setSlide((s) => (s + 1) % n)}>
                <IconArrow />
              </button>
              <div className="lb-indicator">
                <span className="lb-counter">{slide + 1} / {n}</span>
                <span className="lb-dots">
                  {asset.images.map((_, i) => (
                    <button key={i} className={`lb-dot ${i === slide ? "on" : ""}`} aria-label={`${i + 1}번 이미지`} onClick={() => setSlide(i)} />
                  ))}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="lb-panel">
          <div className="lb-head">
            <div>
              <h2 className="lb-title">{asset.title}</h2>
              {asset.dateDisplay && <div className="lb-date">{asset.dateDisplay}</div>}
            </div>
            <div className="lb-actions">
              <button className={`lb-icon-btn ${liked ? "on" : ""}`} aria-label="좋아요" onClick={() => onLike(asset.id)}>
                <IconHeart filled={liked} />
              </button>
              {n > 0 && (
                <button className="lb-icon-btn" aria-label="이미지 다운로드" onClick={downloadImage}>
                  <IconDownload />
                </button>
              )}
              <button className="lb-icon-btn" aria-label="닫기" onClick={onClose}>
                <IconClose />
              </button>
            </div>
          </div>

          <div className="lb-chips">
            {asset.project && <span className="tag chip-proj">{PROJECT_LABELS[asset.project] || asset.project}</span>}
            {asset.type && <span className="tag">{asset.type}</span>}
            {asset.tool && <span className="tag">{asset.tool}</span>}
            {asset.tags.map((t) => <span key={t} className="tag">{t}</span>)}
          </div>

          <div className="lb-links">
            {asset.threadsUrl && (
              <a className="lb-pill lb-pill-threads" href={asset.threadsUrl} target="_blank" rel="noopener noreferrer">
                <IconExternal /> Threads
              </a>
            )}
            {asset.link && (
              <a className="lb-pill" href={asset.link} target="_blank" rel="noopener noreferrer">
                <IconExternal /> GitHub
              </a>
            )}
            <button className={`lb-pill ${inCompare ? "on" : ""}`} onClick={() => onToggleCompare(asset)}>
              <IconCompare /> {inCompare ? "비교에서 제거" : "비교에 추가"}
            </button>
          </div>

          {asset.prompt && (
            <div className="lb-section">
              <div className="lb-label-row">
                <span className="lb-label">PROMPT</span>
                <button className={`lb-copy ${copied ? "done" : ""}`} onClick={copyPrompt}>
                  {copied ? <IconCheck /> : <IconCopy />}
                  {copied ? "복사됨" : "프롬프트 복사"}
                </button>
              </div>
              <pre className="lb-prompt">{asset.prompt}</pre>
            </div>
          )}

          {asset.notes && (
            <div className="lb-section">
              <span className="lb-label">MEMO</span>
              <p className="lb-notes">{asset.notes}</p>
            </div>
          )}

          <div className="lb-foot">
            <span className="lb-no">NO. {asset.no}</span>
            <span className="lb-foot-actions">
              <button className="lb-text-btn" onClick={() => onEdit(asset.raw)}>수정</button>
              <button className="lb-text-btn danger" onClick={() => onDelete(asset.id)}>삭제</button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
