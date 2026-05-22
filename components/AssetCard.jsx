"use client";

const STATUS_COLORS = {
  favorite: { bg: "#fef3c7", color: "#92400e", label: "⭐ favorite" },
  useful: { bg: "#d1fae5", color: "#065f46", label: "useful" },
  test: { bg: "#dbeafe", color: "#1e40af", label: "test" },
  deprecated: { bg: "#fee2e2", color: "#991b1b", label: "deprecated" },
};

const TYPE_EMOJI = {
  image: "🖼",
  portrait: "🪞",
  fashion: "👗",
  travel: "✈️",
  cardnews: "📰",
  prompt: "✏️",
  video: "🎬",
  poster: "🎨",
  repo: "⌥",
};

export default function AssetCard({ asset, onEdit, onDelete }) {
  const status = STATUS_COLORS[asset.status] || { bg: "#f3f4f6", color: "#6b7280", label: asset.status };
  const emoji = TYPE_EMOJI[asset.type] || "📎";

  return (
    <div className="card">
      <div className="card-thumb">
        {asset.image_url ? (
          <img src={asset.image_url} alt={asset.title} className="card-img" />
        ) : (
          <div className="card-placeholder">{emoji}</div>
        )}
        {asset.status && (
          <span className="card-status" style={{ background: status.bg, color: status.color }}>
            {status.label}
          </span>
        )}
      </div>

      <div className="card-body">
        <div className="card-title">{asset.title || "제목 없음"}</div>

        <div className="card-meta">
          {asset.tool && <span className="meta-chip">{asset.tool}</span>}
          {asset.type && <span className="meta-chip">{asset.type}</span>}
        </div>

        {asset.tags && (
          <div className="card-tags">
            {asset.tags.split(",").map((t) => (
              <span key={t} className="tag">{t.trim()}</span>
            ))}
          </div>
        )}

        {asset.image_url && (
          <a href={asset.image_url} target="_blank" rel="noopener noreferrer" className="card-link">
            링크 열기 ↗
          </a>
        )}

        {asset.prompt && (
          <div className="card-prompt">{asset.prompt.slice(0, 80)}{asset.prompt.length > 80 ? "..." : ""}</div>
        )}
      </div>

      <div className="card-actions">
        <button className="action-btn" onClick={() => onEdit(asset)}>수정</button>
        <button className="action-btn danger" onClick={() => onDelete(asset.$id)}>삭제</button>
      </div>
    </div>
  );
}
