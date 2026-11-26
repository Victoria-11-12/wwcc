"use client";

import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/**
 * 弹窗基础行为：打开后聚焦弹窗、锁定页面滚动、限制 Tab 焦点范围，
 * Escape 交给调用方处理，关闭后把焦点还给打开弹窗前的元素。
 *
 * @param containerRef 弹窗最外层元素，焦点循环只在这个元素内部进行
 * @param initialFocusRef 打开时优先聚焦的元素；传 null 则聚焦弹窗本身
 * @param onEscape 按下 Esc 时的回调（例如先关闭下拉，再关闭弹窗）
 */
export function useDialogFocus(
  containerRef: RefObject<HTMLElement | null>,
  initialFocusRef: RefObject<HTMLElement | null> | null,
  onEscape: () => void,
) {
  // 用 ref 保存最新的 Esc 回调，避免父组件每次渲染都重新绑定键盘监听。
  const onEscapeRef = useRef(onEscape);

  useEffect(() => {
    onEscapeRef.current = onEscape;
  }, [onEscape]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    // 记住打开弹窗前聚焦的元素（通常是“新增用户”或“删除”按钮），关闭时还回去。
    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const initialTarget = initialFocusRef?.current ?? container;

    initialTarget.focus({ preventScroll: true });

    // 锁定背景滚动，避免弹窗打开时后面的页面还能滚动。
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // 收集当前可见、可聚焦的元素，用于实现 Tab 首尾循环。
    const getFocusableElements = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter(
        (element) =>
          element.getAttribute("aria-hidden") !== "true" &&
          element.offsetParent !== null,
      );

    const handleKeyDown = (event: KeyboardEvent) => {
      // Esc 交给具体弹窗处理：新增弹窗先关角色下拉，删除弹窗直接取消。
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onEscapeRef.current();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = getFocusableElements();

      if (focusableElements.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;

      // 焦点还在弹窗容器上（刚打开）时，Tab 进入第一个可聚焦元素。
      if (!activeElement || !focusableElements.includes(activeElement)) {
        event.preventDefault();
        (event.shiftKey ? lastElement : firstElement).focus();
        return;
      }

      // 在最后一个元素按 Tab 回到第一个；在第一个元素按 Shift+Tab 回到最后一个。
      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.body.style.overflow = previousOverflow;

      // 关闭弹窗后把焦点还回触发按钮；如果按钮已经随行删除，则不再强制聚焦。
      if (previouslyFocused?.isConnected) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [containerRef, initialFocusRef]);
}
