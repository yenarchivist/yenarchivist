"use client";

import { IconHeart, IconCamera } from "./icons";

const TYPE_EMOJI = {
  image: "🖼", portrait: "🪞", fashion: "👗", travel: "✈️",
  cardnews: "📰", prompt: "✏️", video: "🎬", poster: "🎨", repo: "⌥",
};

export default function AssetCard({ asset, liked, onLike, onOpen }) {
  const cover = asset.images[0];
  const emoji = TYPE_EMOJI[asset.type] || "📎";
  const count = asset.images.length;

  return (
    <article
      className="card"
      data-proj={asset.project}
      onClick={() => onOpen(asset)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") onOpen(asset); }}
    >
      <div className="card-thumb">
        {cover ? (
          <img
            src={cover}
            alt={asset.title}
            className="card-img"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const ph = e.currentTarget.parentElement.querySelector(".card-placeholder");
              if (ph) ph.style.display = "flex";
            }}
          />
        ) : null}
        <div className="card-placeholder" style={{ display: cover ? "none" : "flex" }}>{emoji}</div>

        <button
          className={`card-like ${liked ? "on" : ""}`}
          aria-label={liked ? "좋아요 취소" : "좋아요"}
          onClick={(e) => { e.stopPropagation(); onLike(asset.id); }}
        >
          <IconHeart filled={liked} />
        </button>

        {count > 0 && (
          <span className="card-count" aria-label={`이미지 ${count}장`}>
            <IconCamera />
            {count}
          </span>
        )}
      </div>

      <div className="card-body">
        <div className="card-no">
          <span>NO. {asset.no}</span>
          <span>{count > 0 ? `${count} IMG` : asset.type.toUpperCase()}</span>
        </div>
        <h3 className="card-title">{asset.title}</h3>
        {asset.tags.length > 0 && (
          <div className="card-tags">
            {asset.tags.slice(0, 3).map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
            {asset.tags.length > 3 && <span className="tag tag-more">+{asset.tags.length - 3}</span>}
          </div>
        )}
        <div className="card-extra">
          {asset.prompt && <p className="card-prompt">{asset.prompt}</p>}
          {asset.dateDisplay && <span className="card-date-text">{asset.dateDisplay}</span>}
        </div>
      </div>
    </article>
  );
}
