import { useMemo } from "react";
import { Backdrop } from "./components/Backdrop";
import { BookShelf } from "./components/BookShelf";
import { BookViewer } from "./components/BookViewer";
import { CarouselControls } from "./components/CarouselControls";
import { ErrorState } from "./components/ErrorState";
import { LoadingState } from "./components/LoadingState";
import { useBookshelfData } from "./hooks/useBookshelfData";
import { useCarousel } from "./hooks/useCarousel";
import type { BookCard } from "./types";
import { getBookGeometry } from "./utils";

/** `BookshelfCarousel` 组件接收的属性。 */
type BookshelfCarouselProps = {
  /** 直接传入的书籍数据，优先级高于接口请求。 */
  data?: BookCard[];

  /** 获取书籍数据的接口地址。 */
  apiEndpoint?: string;

  /** 请求接口时携带的请求头。 */
  apiHeaders?: Record<string, string>;

  /** 把接口原始数据转换为 `BookCard[]`。 */
  apiTransform?: (raw: unknown) => BookCard[];

  /** 书架高度，默认 260 像素。 */
  shelfHeight?: number;

  /** 书脊最小宽度，默认 44 像素。 */
  spineMinWidth?: number;

  /** 书脊最大宽度，默认 72 像素。 */
  spineMaxWidth?: number;

  /** 自动轮播间隔，默认 4200 毫秒。 */
  autoInterval?: number;

  /** 点击书籍时执行的回调。 */
  onBookClick?: (card: BookCard) => void;

  /** 当前书籍变化时执行的回调。 */
  onBookChange?: (index: number, card: BookCard) => void;
};

/**
 * 书架轮播主组件。
 *
 * 负责获取书籍数据、计算书脊尺寸、管理轮播状态，
 * 并把背景、书本展示、书架和控制按钮组装成完整页面。
 */
export function BookshelfCarousel({
  data,
  apiEndpoint,
  apiHeaders,
  apiTransform,
  shelfHeight = 260,
  spineMinWidth = 44,
  spineMaxWidth = 72,
  autoInterval = 4200,
  onBookClick,
  onBookChange,
}: BookshelfCarouselProps) {
  // 管理静态数据或网络接口数据的加载状态。
  const { books, loading, error, refetch } = useBookshelfData({
    data,
    apiEndpoint,
    apiHeaders,
    apiTransform,
  });

  const count = books.length;

  // 根据书架尺寸计算每本书的宽度、高度、材质和背景。
  const geometries = useMemo(
    () => getBookGeometry(books, shelfHeight, spineMinWidth, spineMaxWidth),
    [books, shelfHeight, spineMinWidth, spineMaxWidth],
  );

  // 管理当前选中项、悬停项、自动播放、键盘操作和滚动定位。
  const {
    activeIdx,
    hoveredIdx,
    isHovered,
    shelfRef,
    bookRefs,
    selectBook,
    nextBook,
    previousBook,
    handleBookClick,
    setHoveredIdx,
    handleMouseEnter,
    handleMouseLeave,
  } = useCarousel({
    books,
    autoInterval,
    onBookClick,
    onBookChange,
  });

  // 加载期间只显示加载组件。
  if (loading) return <LoadingState />;

  // 请求失败时显示错误信息和重试按钮。
  if (error) return <ErrorState msg={error} onRetry={refetch} />;

  // 没有书籍时显示空状态和重试按钮。
  if (!count) {
    return <ErrorState msg="No books to display." onRetry={refetch} />;
  }

  // 当前索引在正常数据范围内，因此可以直接取得当前书籍及其几何数据。
  const currentBook = books[activeIdx]!;
  const currentGeometry = geometries[activeIdx]!;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Backdrop />

      {/* 上方书本展示区域。 */}
      <div
        style={{
          flex: 1,
          position: "relative",
          zIndex: 10,
          overflow: "visible",
        }}
      >
        <BookViewer
          key={activeIdx}
          book={currentBook}
          geo={currentGeometry}
          idx={activeIdx}
          total={count}
          onOpenClick={() => handleBookClick(activeIdx, currentBook)}
        />
      </div>

      {/* 下方书架和书脊。 */}
      <BookShelf
        books={books}
        geos={geometries}
        activeIdx={activeIdx}
        hoveredIdx={hoveredIdx}
        shelfHeight={shelfHeight}
        shelfRef={shelfRef}
        bookRefs={bookRefs}
        onBookClick={handleBookClick}
        onBookHover={setHoveredIdx}
      />

      {/* 右上角上一本、下一本、圆点和自动播放进度。 */}
      <CarouselControls
        books={books}
        activeIdx={activeIdx}
        hovered={isHovered}
        autoInterval={autoInterval}
        onPrev={previousBook}
        onNext={nextBook}
        onDot={selectBook}
        accent={currentBook.spineColor ?? "#c8873a"}
      />
    </div>
  );
}