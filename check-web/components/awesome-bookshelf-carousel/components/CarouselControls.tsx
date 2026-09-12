import type { CSSProperties } from "react";
import type { BookCard } from "../types";

/** `CarouselControls` 组件需要的属性。 */
type CarouselControlsProps = {
  /** 全部书籍，用来生成底部圆点。 */
  books: BookCard[];

  /** 当前选中书籍的索引。 */
  activeIdx: number;

  /** 鼠标是否停留在轮播区域，悬停时不显示自动播放进度。 */
  hovered: boolean;

  /** 自动播放间隔，用来控制进度条动画时长。 */
  autoInterval: number;

  /** 切换到上一本书。 */
  onPrev: () => void;

  /** 切换到下一本书。 */
  onNext: () => void;

  /** 点击圆点时跳转到指定书籍。 */
  onDot: (index: number) => void;

  /** 当前书籍的主色，用来设置选中圆点和进度条颜色。 */
  accent: string;
};

/** 左右箭头共用的按钮样式。 */
const controlButtonStyle: CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: 2,
  background: "rgba(242,232,208,0.04)",
  border: "1px solid rgba(242,232,208,0.12)",
  color: "rgba(242,232,208,0.5)",
  fontSize: 16,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

/**
 * 书架轮播控制组件。
 *
 * 右上角显示上一本、下一本按钮；中间显示书籍圆点；
 * 圆点下方的一小段横线表示自动播放进度。
 */
export function CarouselControls({
  books,
  activeIdx,
  hovered,
  autoInterval,
  onPrev,
  onNext,
  onDot,
  accent,
}: CarouselControlsProps) {
  return (
    <div
      style={{
        // 固定在页面右上角，并保持在其他内容上方。
        position: "absolute",
        top: "clamp(20px,3vh,36px)",
        right: "clamp(20px,3vw,40px)",
        zIndex: 30,
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      {/* 切换到上一本书。 */}
      <button style={controlButtonStyle} onClick={onPrev}>
        ←
      </button>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        {/* 每本书对应一个圆点，选中项会变宽并使用当前主色。 */}
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          {books.map((book, index) => (
            <button
              key={book.id}
              onClick={() => onDot(index)}
              style={{
                border: "none",
                padding: 0,
                cursor: "pointer",
                width: index === activeIdx ? 18 : 5,
                height: 5,
                borderRadius: 2.5,
                background:
                  index === activeIdx ? accent : "rgba(242,232,208,0.18)",
                boxShadow: index === activeIdx ? `0 0 8px ${accent}aa` : "none",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>

        {/* 自动播放进度；鼠标悬停时暂停，因此不显示进度条。 */}
        <div
          style={{
            width: 56,
            height: 1,
            background: "rgba(242,232,208,0.08)",
            overflow: "hidden",
            borderRadius: 1,
          }}
        >
          {!hovered && (
            <div
              key={`${activeIdx}-p`}
              style={{
                height: "100%",
                background: `linear-gradient(to right, ${accent}, rgba(242,232,208,0.3))`,
                animation: `progressAnim ${autoInterval}ms linear forwards`,
              }}
            />
          )}
        </div>
      </div>

      {/* 切换到下一本书。 */}
      <button style={controlButtonStyle} onClick={onNext}>
        →
      </button>
    </div>
  );
}