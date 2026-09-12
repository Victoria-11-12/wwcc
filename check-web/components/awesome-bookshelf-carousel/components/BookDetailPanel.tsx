import { useState } from "react";
import type { BookCard } from "../types";
import type { BookGeometry } from "../utils";

/** `BookDetailPanel` 组件需要的属性。 */
type BookDetailPanelProps = {
  /** 当前需要展示的书籍。 */
  book: BookCard;

  /** `book` 对应的尺寸和背景计算结果。 */
  geo: BookGeometry;

  /** 点击书本时执行的打开回调。 */
  onOpenClick: () => void;
};

/**
 * 展示当前选中书籍的立体书本。
 *
 * 组件包含书脊和封面：鼠标悬停时会增强旋转和阴影，
 * 点击后通过 `onOpenClick` 通知主组件执行打开操作。
 */
export function BookDetailPanel({
  book,
  geo,
  onOpenClick,
}: BookDetailPanelProps) {
  // 鼠标是否悬停在书本上，用于放大旋转效果和阴影。
  const [isHovered, setIsHovered] = useState(false);

  // 封面宽度；高度保持接近真实书本的 1:1.42 比例。
  const coverWidth = 130;
  const coverHeight = Math.round(coverWidth * 1.42);

  // 书脊宽度。
  const spineWidth = 28;

  // 当前书本的主色，用于阴影和外发光。
  const accent = book.spineColor;

  return (
    <div
      style={{ perspective: "900px", cursor: "pointer" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onOpenClick}
    >
      {/* 书脊和封面放在同一个 3D 容器中，并保留缩放后的透视效果。 */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          transformStyle: "preserve-3d",
          transform: isHovered
            ? "rotateY(-22deg) rotateX(2deg) translateY(-6px)"
            : "rotateY(-14deg) rotateX(1deg)",
          transition: "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {/* 书脊：沿垂直方向显示书名，并带有内阴影。 */}
        <div
          style={{
            width: spineWidth,
            height: coverHeight,
            background: geo.bgCss,
            boxShadow: "inset -3px 0 8px rgba(0,0,0,0.4)",
            transformOrigin: "right center",
            transform: "rotateY(90deg) translateZ(-1px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              transform: "rotate(180deg)",
              fontFamily: "var(--font-spine)",
              fontSize: 9,
              fontWeight: 500,
              letterSpacing: "0.14em",
              color: "rgba(255,255,255,0.6)",
              textTransform: "uppercase",
              maxHeight: coverHeight - 20,
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {book.title}
          </div>
        </div>

        {/* 封面区域：优先显示图片，没有图片时显示材质背景。 */}
        <div
          style={{
            width: coverWidth,
            height: coverHeight,
            position: "relative",
            overflow: "hidden",
            boxShadow: isHovered
              ? `6px 12px 40px rgba(0,0,0,0.7), 0 0 20px ${accent}44`
              : "4px 8px 28px rgba(0,0,0,0.6)",
            transition: "box-shadow 0.45s ease",
          }}
        >
          {book.imageUrl ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${book.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: geo.bgCss,
              }}
            />
          )}

          {/* 底部渐变让书名和作者更容易阅读。 */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.65) 100%)",
            }}
          />

          {/* 封面底部的书名和作者信息。 */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "12px 10px",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: Math.max(9, Math.min(13, coverWidth / 10)),
                fontWeight: 400,
                lineHeight: 1.2,
                color: "rgba(242,232,208,0.92)",
                textShadow: "0 1px 6px rgba(0,0,0,0.8)",
                letterSpacing: "0.01em",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {book.title}
            </div>

            {book.author && (
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 8,
                  color: "rgba(242,232,208,0.55)",
                  marginTop: 3,
                  fontStyle: "italic",
                  letterSpacing: "0.06em",
                  textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                }}
              >
                {book.author}
              </div>
            )}
          </div>

          {/* 左上角高光，让封面看起来更有光泽。 */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}