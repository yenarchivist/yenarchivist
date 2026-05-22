"use client";

const STATUS_COLORS = {
  favorite: { bg: "#fef3c7", color: "#92400e", label: "⭐ favorite" },
  useful: { bg: "#d1fae5", color: "#065f46", label: "useful" },
  test: { bg: "#dbeafe", color: "#1e40af", label: "test" },
  deprecated: { bg: "#fee2e2", color: "#991b1b", label: "deprecated" },
};

const PROJECT_LABELS = {
  dingu: "🐾 띵구",
  yenarity: "✦ 예나리티",
  "github-mine": "⌥ 내 GitHub",
  "github-repo": "★ 좋은 Repo",
};

export default function DetailModal({ asset, onEdit, onClose }) {
  if (!asset) return null;
  const status = STATUS_COLORS[asset.status] || { bg: "#f3f4f6", color: "#6b7280", label: asset.status };
  const createdAt = asset.$createdAt ? new Date(asset.$createdAt).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" }) : null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal detail-modal">
        <div className="detail-header">
          <div className="detail-meta-top">
            {asset.project && <span className="detail-project">{PROJECT_LABELS[asset.project] || asset.project}</span>}
            {asset.status && <span className="card-status" style={{ background: status.bg, color: status.color, position: "static", fontSize: "11px", padding: "3px 10px", borderRadius: "10px" }}>{status.label}</span>}
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {asset.image_url && (
          <div className="detail-img-wrap">
            <img src={asset.image_url} alt={asset.title} className="detail-img" onError={(e) => e.target.style.display = "none"} />
          </div>
        )}

        <div className="detail-body">
          <h2 className="detail-title">{asset.title || "제목 없음"}</h2>

          <div className="detail-chips">
            {asset.tool && <span className="meta-chip">{asset.tool}</span>}
            {asset.type && <span className="meta-chip">{asset.type}</span>}
            {createdAt && <span className="meta-chip">{createdAt}</span>}
            {asset.rating > 0 && <span className="meta-chip">{"⭐".repeat(asset.rating)}</span>}
          </div>

          {asset.tags && (
            <div className="detail-section">
              <div className="detail-label">태그</div>
              <div className="card-tags">
                {asset.tags.split(",").map((t) => (
                  <span key={t} className="tag">{t.trim()}</span>
                ))}
              </div>
            </div>
          )}

          {asset.prompt && (
            <div className="detail-section">
              <div className="detail-label">프롬프트</div>
              <div className="detail-prompt">{asset.prompt}</div>
            </div>
          )}

          {asset.notes && (
            <div className="detail-section">
              <div className="detail-label">메모</div>
              <div className="detail-notes">{asset.notes}</div>
            </div>
          )}

          {asset.image_url && (
            <div className="detail-section">
              <div className="detail-label">URL</div>
              <a href={asset.image_url} target="_blank" rel="noopener noreferrer" className="detail-url">{asset.image_url}</a>
            </div>
          )}
        </div>

        <div className="modal-actions" style={{ padding: "0 24px 24px" }}>
          <button className="btn-cancel" onClick={onClose}>닫기</button>
          <button className="btn-save" onClick={() => { onEdit(asset); onClose(); }}>수정하기</button>
        </div>
      </div>
    </div>
  );
}
