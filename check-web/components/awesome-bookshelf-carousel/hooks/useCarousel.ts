import { useCallback, useEffect, useRef, useState } from "react";
import type { BookCard } from "../types";

/** `useCarousel` 接收的参数。 */
type UseCarouselOptions = {
  /** 当前轮播使用的书籍列表。 */
  books: BookCard[];

  /** 自动切换间隔，单位是毫秒，默认 4200 毫秒。 */
  autoInterval?: number;

  /** 点击当前已选中的书时执行的回调。 */
  onBookClick?: (card: BookCard) => void;

  /** 当前选中的书发生变化时执行的回调。 */
  onBookChange?: (index: number, card: BookCard) => void;
};

/**
 * 管理书架轮播的交互状态。
 *
 * 主要职责包括选中项、鼠标悬停、自动轮播、键盘控制、书架滚动定位，
 * 以及向主组件提供切换书籍所需的状态和事件处理函数。
 */
export function useCarousel({
  books,
  autoInterval = 4200,
  onBookClick,
  onBookChange,
}: UseCarouselOptions) {
  // 当前选中的书在 books 数组中的索引。
  const [activeIdx, setActiveIdx] = useState(0);

  // 鼠标当前悬停的书索引；null 表示没有悬停任何书。
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // 鼠标是否停留在整个轮播区域内，用于暂停自动播放。
  const [isHovered, setIsHovered] = useState(false);

  /** 保存最新选中索引，供定时器和事件回调读取，避免闭包拿到旧值。 */
  const activeIndexRef = useRef(0);

  /** 保存自动轮播定时器 ID，方便依赖变化或卸载时清理。 */
  const autoIntervalRef = useRef(0);

  /** 指向可横向滚动的书架容器。 */
  const shelfRef = useRef<HTMLDivElement | null>(null);

  /** 保存每根书脊对应的 DOM 节点，用于计算滚动位置。 */
  const bookRefs = useRef<Array<HTMLDivElement | null>>([]);

  const count = books.length;

  /** 切换到指定书籍；只有索引变化时才更新状态并触发回调。 */
  const selectBook = useCallback(
    (index: number) => {
      if (index !== activeIndexRef.current) {
        activeIndexRef.current = index;
        setActiveIdx(index);
        onBookChange?.(index, books[index]);
      }
    },
    [books, onBookChange],
  );

  /** 切换到下一本书，到达末尾后循环回第一本。 */
  const nextBook = useCallback(
    () => selectBook((activeIndexRef.current + 1) % count),
    [selectBook, count],
  );

  /** 切换到上一本书，到达开头后循环到最后一本。 */
  const previousBook = useCallback(
    () => selectBook((activeIndexRef.current - 1 + count) % count),
    [selectBook, count],
  );

  useEffect(() => {
    // 鼠标未悬停且至少有两本书时开启自动轮播。
    if (!(isHovered || count < 2)) {
      autoIntervalRef.current = window.setInterval(nextBook, autoInterval);

      // 依赖变化或组件卸载时清除旧定时器，避免重复计时。
      return () => clearInterval(autoIntervalRef.current);
    }
  }, [autoInterval, count, isHovered, nextBook]);

  useEffect(() => {
    // 监听键盘左右方向键，并在组件卸载时移除监听。
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") nextBook();
      if (event.key === "ArrowLeft") previousBook();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextBook, previousBook]);

  useEffect(() => {
    // 当前书变化后，让它在书架容器中滚动到接近中间的位置。
    const activeBook = bookRefs.current[activeIdx];
    const shelf = shelfRef.current;
    if (!activeBook || !shelf) return;

    const targetLeft =
      activeBook.offsetLeft - shelf.clientWidth / 2 + activeBook.offsetWidth / 2;
    shelf.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" });
  }, [activeIdx]);

  // 组件卸载时做最后一次定时器清理。
  useEffect(() => () => clearInterval(autoIntervalRef.current), []);

  /** 处理书脊点击：未选中的书先切换，当前书则执行打开回调。 */
  const handleBookClick = useCallback(
    (index: number, book: BookCard) => {
      if (index !== activeIndexRef.current) {
        selectBook(index);
      } else {
        // 优先使用单本书自己的 onClick，其次使用组件的 onBookClick。
        const clickHandler = book.onClick ?? onBookClick;
        clickHandler?.(book);
      }
    },
    [onBookClick, selectBook],
  );

  /** 鼠标进入轮播区域时暂停自动播放。 */
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);

  /** 鼠标离开轮播区域时恢复自动播放，并清除悬停书籍。 */
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setHoveredIdx(null);
  }, []);

  // 返回状态、DOM 引用和事件处理函数，供主组件和子组件使用。
  return {
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
  };
}