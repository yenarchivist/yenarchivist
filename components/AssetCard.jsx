"use client";

const STATUS_COLORS = {
  favorite: { bg: "#fef3c7", color: "#92400e", label: "⭐ favorite" },
  useful: { bg: "#d1fae5", color: "#065f46", label: "useful" },
  test: { bg: "#dbeafe", color: "#1e40af", label: "test" },
  deprecated: { bg: "#fee2e2", color: "#991b1b", label: "deprecated" },
};

const TYPE_EMOJI = {
  image: "🖼", portrait: "🪞", fashion: "👗", travel: "✈️",
  cardnews: "📰", prompt: "✏️", video: "🎬", poster: "🎨", repo: "⌥",
};

export default function AssetCard({ asset, onEdit, onDelete, onDetail }) {
  const status = STATUS_COLORS[asset.status] || { bg: "#f3f4f6", color: "#6b7280", label: asset.status };
  const emoji = TYPE_EMOJI[asset.type] || "📎";
  const createdAt = asset.$createdAt ? new Date(asset.$createdAt).toLocaleDateString("sv-SE", { year: "numeric", month: "2-digit", day: "2-digit" }) : null;

  return (
    <div className="card">
      <div className="card-thumb" onClick={() => onDetail(asset)} style={{ cursor: "pointer" }}>
        {asset.image_url ? (
          <img src={asset.image_url} alt={asset.title} className="card-img" onError={(e) => { e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }} />
        ) : null}
        <div className="card-placeholder" style={{ display: asset.image_url ? "none" : "flex" }}>{emoji}</div>
        {asset.status && (
          <span className="card-status" style={{ background: status.bg, color: status.color }}>
            {status.label}
          </span>
        )}
        {createdAt && <span className="card-date">{createdAt}</span>}
      </div>

      <div className="card-body" onClick={() => onDetail(asset)} style={{ cursor: "pointer" }}>
        <div className="card-title">{asset.title || "제목 없음"}</div>
        <div className="card-meta">
          {asset.tool && <span className="meta-chip">{asset.tool}</span>}
          {asset.type && <span className="meta-chip">{asset.type}</span>}
        </div>
        {asset.tags && (
          <div className="card-tags">
            {asset.tags.split(",").slice(0, 3).map((t) => (
              <span key={t} className="tag">{t.trim()}</span>
            ))}
            {asset.tags.split(",").length > 3 && <span className="tag">+{asset.tags.split(",").length - 3}</span>}
          </div>
        )}
        {asset.prompt && (
          <div className="card-prompt">{asset.prompt.slice(0, 60)}{asset.prompt.length > 60 ? "..." : ""}</div>
        )}
      </div>

      <div className="card-actions">
        <button className="action-btn" onClick={() => onDetail(asset)}>보기</button>
        <button className="action-btn" onClick={() => onEdit(asset)}>수정</button>
        <button className="action-btn danger" onClick={() => onDelete(asset.$id)}>삭제</button>
      </div>
    </div>
  );
}
