"use client";

import { useState } from "react";
import { IconClose, IconCopy, IconCheck } from "./icons";

export default function CompareModal({ items, onRemove, onClose }) {
  const [copiedId, setCopiedId] = useState("");

  async function copy(item) {
    try {
      await navigator.clipboard.writeText(item.prompt || "");
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(""), 1500);
    } catch { /* noop */ }
  }

  return (
    <div className="cmp-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cmp-panel">
        <div className="cmp-head">
          <span className="lb-label">COMPARE · {items.length}</span>
          <button className="lb-icon-btn" aria-label="닫기" onClick={onClose}><IconClose /></button>
        </div>
        <div className="cmp-grid" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
          {items.map((item) => (
            <div className="cmp-col" data-proj={item.project} key={item.id}>
              <div className="cmp-thumb">
                {item.images[0]
                  ? <img src={item.images[0]} alt={item.title} />
                  : <div className="card-placeholder" style={{ display: "flex" }}>📎</div>}
              </div>
              <div className="cmp-body">
                <div className="card-no"><span>NO. {item.no}</span><span>{item.images.length} IMG</span></div>
                <h3 className="cmp-title">{item.title}</h3>
                {item.prompt
                  ? <pre className="cmp-prompt">{item.prompt}</pre>
                  : <p className="cmp-noprompt">프롬프트 없음</p>}
                <div className="cmp-actions">
                  <button className={`lb-copy ${copiedId === item.id ? "done" : ""}`} onClick={() => copy(item)}>
                    {copiedId === item.id ? <IconCheck /> : <IconCopy />}
                    {copiedId === item.id ? "복사됨" : "복사"}
                  </button>
                  <button className="lb-text-btn" onClick={() => onRemove(item.id)}>제거</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
