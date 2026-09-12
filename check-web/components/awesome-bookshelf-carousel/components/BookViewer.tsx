import { useEffect, useState } from "react";
import { BookDetailPanel } from "./BookDetailPanel";
import type { BookCard } from "../types";
import type { BookGeometry } from "../utils";
import { isDarkColor } from "../utils";

/** `BookViewer` 组件需要的属性。 */
type BookViewerProps = {
  /** 当前显示的书籍；没有书籍时组件返回 null。 */
  book?: BookCard;

  /** 当前书籍的尺寸和背景计算结果。 */
  geo: BookGeometry;

  /** 当前书籍在所有书籍中的索引。 */
  idx: number;

  /** 书籍总数，用于显示类似 `03 / 12` 的进度。 */
  total: number;

  /** 点击书本或按钮时执行的回调。 */
  onOpenClick: () => void;
};

/**
 * 当前选中书籍的主要展示区域。
 *
 * 左侧显示立体书本，右侧显示分类、年份、书名、作者、简介和引用，
 * 同时根据屏幕宽度切换为横向或纵向布局。
 */
export function BookViewer({
  book,
  geo,
  idx,
  total,
  onOpenClick,
}: BookViewerProps) {
  // book 不存在时没有任何内容可以展示。
  if (!book) return null;

  // 小于 820px 时使用纵向布局，其他尺寸使用横向布局。
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 820,
  );

  useEffect(() => {
    // 监听浏览器窗口尺寸变化，实时切换移动端布局。
    const handleResize = () => setIsMobile(window.innerWidth < 820);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const accent = book.spineColor;

  // 保留原有颜色判断调用；当前返回值暂未参与界面渲染。
  isDarkColor(accent);

  return (
    <div
      style={{
        // 铺满父容器，并根据屏幕宽度切换排列方向。
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: isMobile ? "center" : "stretch",
        flexDirection: isMobile ? "column" : "row",
        paddingTop: isMobile
          ? "clamp(28px,6vw,48px)"
          : "clamp(64px,6.5vw,112px)",
        paddingRight: "clamp(28px,4vw,56px)",
        paddingBottom: isMobile
          ? "clamp(18px,4vw,32px)"
          : "clamp(28px,4vw,56px)",
        paddingLeft: "clamp(28px,4vw,56px)",
        gap: isMobile
          ? "clamp(16px,4vw,24px)"
          : "clamp(24px,3vw,48px)",
        transform: isMobile ? "none" : "translateY(18px)",
      }}
    >
      {/* 左侧：放大显示的立体书本。 */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: isMobile ? "center" : "flex-start",
          perspective: "800px",
          animation: "fadeIn 0.4s ease both",
        }}
      >
        <BookDetailPanel
          book={book}
          geo={geo}
          onOpenClick={onOpenClick}
        />
      </div>

      {/* 右侧：书名、作者和书籍介绍。 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: isMobile ? "center" : "flex-end",
          alignItems: isMobile ? "center" : "stretch",
          textAlign: isMobile ? "center" : "left",
          paddingBottom: isMobile ? 0 : 8,
          maxWidth: isMobile ? 640 : 520,
        }}
      >        {/* 分类、年份和当前进度。 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 6,
            marginBottom: 20,
            animation: "fadeUp 0.4s 0.04s ease both",
            opacity: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {book.genre && (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: accent,
                  padding: "3px 10px",
                  border: `1px solid ${accent}55`,
                  background: `${accent}18`,
                }}
              >
                {book.genre}
              </span>
            )}

            {book.year && (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  letterSpacing: "0.14em",
                  color: "rgba(242,232,208,0.35)",
                }}
              >
                {book.year}
              </span>
            )}
          </div>

          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              color: "rgba(242,232,208,0.25)",
              letterSpacing: "0.16em",
            }}
          >
            {String(idx + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </span>
        </div>

        {/* 书名使用展示字体，并通过透明度变化执行淡入动画。 */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(26px, 3.6vw, 50px)",
            fontWeight: 400,
            lineHeight: 1.26,
            color: "var(--paper)",
            letterSpacing: "-0.01em",
            marginTop: 12,
            paddingTop: 6,
            marginBottom: 10,
            animation: "fadeUp 0.45s 0.08s ease both",
            opacity: 0,
          }}
        >
          {book.title}
        </h1>

        {/* 作者信息。 */}
        {book.author && (
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(13px, 1.4vw, 17px)",
              fontStyle: "italic",
              fontWeight: 300,
              color: accent,
              letterSpacing: "0.04em",
              marginBottom: 18,
              textShadow: `0 0 20px ${accent}55`,
              animation: "fadeUp 0.45s 0.12s ease both",
              opacity: 0,
            }}
          >
            by {book.author}
          </div>
        )}

        {/* 书名和简介之间的装饰分隔线。 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 18,
            animation: "fadeUp 0.45s 0.15s ease both",
            opacity: 0,
          }}
        >
          <div style={{ height: 1, width: 24, background: `${accent}aa` }} />
          <div
            style={{
              width: 5,
              height: 5,
              background: accent,
              transform: "rotate(45deg)",
            }}
          />
          <div
            style={{
              height: 1,
              flex: 1,
              background: `linear-gradient(to right, ${accent}aa, transparent)`,
            }}
          />
        </div>        {/* 书籍简介。 */}
        {book.blurb && (
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(13px, 1.3vw, 16px)",
              fontWeight: 300,
              lineHeight: 1.8,
              color: "rgba(242,232,208,0.62)",
              marginBottom: 20,
              maxWidth: 480,
              animation: "fadeUp 0.45s 0.19s ease both",
              opacity: 0,
            }}
          >
            {book.blurb}
          </p>
        )}

        {/* 书中的代表性引用，使用左侧色条强调。 */}
        {book.quote && (
          <blockquote
            style={{
              borderLeft: `2px solid ${accent}66`,
              paddingLeft: 14,
              marginBottom: 20,
              fontFamily: "var(--font-display)",
              fontSize: "clamp(12px, 1.2vw, 15px)",
              fontStyle: "italic",
              fontWeight: 400,
              color: "rgba(242,232,208,0.44)",
              lineHeight: 1.65,
              animation: "fadeUp 0.45s 0.23s ease both",
              opacity: 0,
            }}
          >
            "{book.quote}"
          </blockquote>
        )}

        {/* 打开书籍按钮，悬停时增加背景色和外发光。 */}
        <div
          style={{
            animation: "fadeUp 0.45s 0.28s ease both",
            opacity: 0,
          }}
        >
          <button
            onClick={onOpenClick}
            style={{
              background: "transparent",
              border: `1px solid ${accent}60`,
              color: accent,
              padding: "9px 24px",
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.25s ease",
              boxShadow: `0 0 0 0 ${accent}00`,
            }}
            onMouseEnter={(event) => {
              const button = event.currentTarget;
              button.style.background = `${accent}22`;
              button.style.boxShadow = `0 0 18px ${accent}44`;
            }}
            onMouseLeave={(event) => {
              const button = event.currentTarget;
              button.style.background = "transparent";
              button.style.boxShadow = `0 0 0 0 ${accent}00`;
            }}
          >
            Open Book
          </button>
        </div>
      </div>
    </div>
  );
}