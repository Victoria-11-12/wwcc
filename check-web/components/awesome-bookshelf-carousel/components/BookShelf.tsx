import type { CSSProperties, RefObject } from "react";
import { BookSpine } from "./BookSpine";
import type { BookCard } from "../types";
import type { BookGeometry } from "../utils";

/** `BookShelf` 组件需要的属性。 */
type BookShelfProps = {
  /** 全部书籍数据。 */
  books: BookCard[];

  /** 每本书计算后的宽度、高度和背景样式。 */
  geos: BookGeometry[];

  /** 当前选中书籍的索引。 */
  activeIdx: number;

  /** 当前鼠标悬停书籍的索引；null 表示没有悬停。 */
  hoveredIdx: number | null;

  /** 书架高度，用于计算木板和侧板的尺寸。 */
  shelfHeight: number;

  /** 指向横向滚动的书架容器。 */
  shelfRef: RefObject<HTMLDivElement | null>;

  /** 保存每根书脊对应的 DOM 节点，用于滚动定位。 */
  bookRefs: RefObject<Array<HTMLDivElement | null>>;

  /** 点击书脊时执行的回调。 */
  onBookClick: (index: number, book: BookCard) => void;

  /** 鼠标进入或离开书脊时更新悬停索引。 */
  onBookHover: (index: number | null) => void;
};

/**
 * 书架主体组件。
 *
 * 包含背景木板、横向滚动容器、左右侧板和一排书脊。
 * 当前选中的书会抬高，鼠标悬停的书会产生较小的抬升效果。
 */
export function BookShelf({
  books,
  geos,
  activeIdx,
  hoveredIdx,
  shelfHeight,
  shelfRef,
  bookRefs,
  onBookClick,
  onBookHover,
}: BookShelfProps) {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 20,
        flexShrink: 0,
        width: "100%",
      }}
    >
      {/* 书架背后的深色木质底板。 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: shelfHeight + 22 + 14,
          background: `
          linear-gradient(to bottom,
            #1e1308 0%,
            var(--wood-dark) 20%,
            #251a0c 60%,
            #1a1008 100%
          )
        `,
          zIndex: 0,
        }}
      />

      {/* 可横向滚动的书脊区域。 */}
      <div
        ref={shelfRef}
        style={{
          position: "relative",
          zIndex: 5,
          overflowX: "auto",
          overflowY: "visible",
          scrollbarWidth: "none",
          display: "flex",
          alignItems: "flex-end",
          padding: "0 clamp(40px,8vw,120px) 0",
          paddingBottom: 60,
          gap: 3,
          height: shelfHeight + 22 + 14 + 64,
          perspective: "700px",
          perspectiveOrigin: "50% 100%",
        }}
      >
        <ShelfSide side="left" height={shelfHeight} />

        {books.map((book, index) => {
          const geo = geos[index];
          const isActive = index === activeIdx;
          const isHovered = hoveredIdx === index && !isActive;

          return (
            <div
              key={book.id}
              ref={(element) => {
                // 保存每根书脊的 DOM 节点，供 useCarousel 计算滚动位置。
                bookRefs.current[index] = element;
              }}
              onMouseEnter={() => onBookHover(index)}
              onMouseLeave={() => onBookHover(null)}
              onClick={() => onBookClick(index, book)}
              style={{
                flexShrink: 0,
                width: geo.width,
                height: geo.height,
                cursor: "pointer",
                position: "relative",
                alignSelf: "flex-end",
                transformStyle: "preserve-3d",
                // 选中和悬停状态分别抬高不同的距离。
                transform: isActive
                  ? "translateY(-20px) translateZ(28px) rotateY(-5deg)"
                  : isHovered
                    ? "translateY(-9px) translateZ(10px) rotateY(-2deg)"
                    : "translateY(0) translateZ(0) rotateY(0deg)",
                transition:
                  "transform 0.38s cubic-bezier(0.34, 1.4, 0.64, 1)",
                zIndex: isActive ? 10 : isHovered ? 6 : 1,
              }}
            >
              <BookSpine
                book={book}
                geo={geo}
                isActive={isActive}
                isHovered={isHovered}
              />
            </div>
          );
        })}

        <ShelfSide side="right" height={shelfHeight} />
      </div>

      <ShelfPlank plankH={22} depthH={14} />

      {/* 书架顶部的阴影，让书脊和木板之间形成层次。 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: shelfHeight + 2,
          height: 14,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%)",
          zIndex: 6,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
/** 书架底部的木板和木板下方阴影。 */
function ShelfPlank({ plankH, depthH }: { plankH: number; depthH: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 7,
        pointerEvents: "none",
      }}
    >
      {/* 木板正面：重复纹理模拟木条，并叠加上下方向的木色渐变。 */}
      <div
        style={{
          height: plankH,
          background: `
          repeating-linear-gradient(
            90deg,
            transparent 0px,
            transparent 60px,
            rgba(0,0,0,0.06) 60px,
            rgba(0,0,0,0.06) 62px
          ),
          linear-gradient(to bottom,
            var(--wood-edge)  0%,
            var(--wood-light) 30%,
            var(--wood-mid)   70%,
            var(--wood-dark)  100%
          )
        `,
          boxShadow:
            "inset 0 2px 4px rgba(255,255,255,0.08), inset 0 -2px 6px rgba(0,0,0,0.4)",
        }}
      />

      {/* 木板厚度区域，增强书架的立体感。 */}
      <div
        style={{
          height: depthH,
          background: "linear-gradient(to bottom, var(--wood-dark), #160e06)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.7)",
        }}
      />
    </div>
  );
}

/** 书架左右两侧的侧板。 */
function ShelfSide({
  side,
  height,
}: {
  side: "left" | "right";
  height: number;
}) {
  return (
    <div
      style={{
        flexShrink: 0,
        width: 20,
        height: height + 10,
        alignSelf: "flex-end",
        // 根据左右位置改变渐变方向和阴影方向。
        background: `linear-gradient(${side === "left" ? "90deg" : "270deg"}, var(--wood-edge), var(--wood-dark))`,
        boxShadow:
          side === "left"
            ? "2px 0 8px rgba(0,0,0,0.4)"
            : "-2px 0 8px rgba(0,0,0,0.4)",
        position: "relative",
        zIndex: 2,
      }}
    >
      {/* 三个小圆点模拟侧板上的固定螺丝。 */}
      {[0.25, 0.5, 0.75].map((position) => (
        <div
          key={position}
          style={
            {
              position: "absolute",
              [side === "left" ? "right" : "left"]: 5,
              top: `${position * 100}%`,
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)",
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}