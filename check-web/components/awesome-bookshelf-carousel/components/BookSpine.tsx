import type { BookCard } from "../types";
import type { BookGeometry } from "../utils";

/** `BookSpine` 组件需要的属性。 */
type BookSpineProps = {
  /** 当前书脊对应的书籍数据。 */
  book: BookCard;

  /** 书籍的宽度、高度和背景样式。 */
  geo: BookGeometry;

  /** 是否是当前选中的书。 */
  isActive: boolean;

  /** 鼠标是否悬停在这本书上。 */
  isHovered: boolean;
};

/**
 * 书架上的一根书本侧边。
 *
 * 正常情况下只显示书脊；选中时会显示金色流光，悬停时会增强阴影，
 * 书名使用竖排文字显示。
 */
export function BookSpine({
  book,
  geo,
  isActive,
  isHovered,
}: BookSpineProps) {
  const accent = book.spineColor;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: geo.bgCss,
        backgroundSize: "8px 8px, 100% 100%",
        // 选中、悬停和普通状态使用不同强度的阴影。
        boxShadow: isActive
          ? `inset 2px 0 5px rgba(255,255,255,0.14), inset -2px 0 8px rgba(0,0,0,0.5), 4px 0 20px rgba(0,0,0,0.6), 0 0 18px ${accent}50`
          : isHovered
            ? `inset 2px 0 4px rgba(255,255,255,0.10), inset -1px 0 6px rgba(0,0,0,0.4), 3px 0 14px rgba(0,0,0,0.5), 0 0 8px ${accent}28`
            : "inset 1px 0 3px rgba(255,255,255,0.07), inset -1px 0 4px rgba(0,0,0,0.35), 2px 0 8px rgba(0,0,0,0.4)",
        transition: "box-shadow 0.3s ease",
        overflow: "hidden",
      }}
    >
      {/* 选中书脊上的金色流光，覆盖整个书脊并持续移动。 */}
      {isActive && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(90deg, transparent, ${accent}22, transparent)`,
            backgroundSize: "200% 100%",
            animation: "goldShimmer 2.4s ease-in-out infinite",
          }}
        />
      )}

      {/* 书脊顶部的浅色书页边缘。 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "linear-gradient(to bottom, #e8dfc8, #c4b890)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        }}
      />

      {/* 竖排书名区域。 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 10,
          paddingBottom: 8,
          gap: 6,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            width: "100%",
          }}
        >
          <div
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              transform: "rotate(180deg)",
              fontFamily: "var(--font-spine)",
              fontSize: Math.max(8, Math.min(11, geo.width * 0.16)),
              fontWeight: isActive ? 600 : 400,
              letterSpacing: "0.10em",
              lineHeight: 1.1,
              color: isActive
                ? "rgba(255,255,255,0.92)"
                : "rgba(255,255,255,0.62)",
              textTransform: "uppercase",
              textShadow: isActive ? `0 0 10px ${accent}88` : "none",
              transition: "all 0.3s ease",
              maxHeight: "75%",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {book.title}
          </div>
        </div>

        {/* 选中状态底部的小圆点。 */}
        {isActive && (
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: accent,
              boxShadow: `0 0 6px ${accent}`,
              flexShrink: 0,
            }}
          />
        )}
      </div>

      {/* 书脊底部阴影，让图形与书架衔接得更自然。 */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 10,
          background:
            "linear-gradient(to bottom, transparent, rgba(0,0,0,0.4))",
        }}
      />
    </div>
  );
}