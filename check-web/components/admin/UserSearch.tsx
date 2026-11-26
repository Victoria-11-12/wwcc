"use client";

import { useEffect, useId, useRef } from "react";
import { cn } from "@/lib/utils";
import type { AdminUser } from "@/components/admin/user-data";
import styles from "./UserSearch.module.css";

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}

interface UserSearchProps {
  query: string;
  suggestions: AdminUser[];
  activeIndex: number;
  open: boolean;
  onChange: (value: string) => void;
  onApply: (value: string) => void;
  onOpenChange: (open: boolean) => void;
  onActiveIndexChange: (index: number) => void;
}

/**
 * 用户搜索框 + 建议列表（受控组合框）。
 *
 * 组件本身不保存搜索词、建议数据和展开状态，全部由 UserManagement 传入，
 * 这样父组件可以在打开新增/删除弹窗前统一收起建议浮层。
 *
 * 三个筛选入口：
 * 1. 点击建议项 → 用该用户名筛选；
 * 2. 点击放大镜 → 用当前输入值筛选；
 * 3. 输入框按 Enter → 有高亮建议时选建议，否则用当前输入值筛选。
 */
export default function UserSearch({
  query,
  suggestions,
  activeIndex,
  open,
  onChange,
  onApply,
  onOpenChange,
  onActiveIndexChange,
}: UserSearchProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const hasSuggestions = suggestions.length > 0;
  const expanded = open && hasSuggestions;

  // 点击搜索框和建议浮层以外的区域时收起建议。
  useEffect(() => {
    if (!expanded) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onOpenChange(false);
        onActiveIndexChange(-1);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown, true);

    return () =>
      document.removeEventListener("pointerdown", handlePointerDown, true);
  }, [expanded, onOpenChange, onActiveIndexChange]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // 方向键在建议项之间循环；浮层未展开时先展开并定位到第一/最后一项。
    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (!expanded) {
        if (hasSuggestions) {
          onOpenChange(true);
          onActiveIndexChange(0);
        }
        return;
      }

      onActiveIndexChange((activeIndex + 1) % suggestions.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (!expanded) {
        if (hasSuggestions) {
          onOpenChange(true);
          onActiveIndexChange(suggestions.length - 1);
        }
        return;
      }

      onActiveIndexChange(
        (activeIndex - 1 + suggestions.length) % suggestions.length,
      );
      return;
    }

    // Enter：优先选择当前高亮的建议，否则把输入框里的关键词应用为筛选条件。
    if (event.key === "Enter") {
      event.preventDefault();

      if (expanded && activeIndex >= 0 && suggestions[activeIndex]) {
        onApply(suggestions[activeIndex].name);
        return;
      }

      onApply(query);
      return;
    }

    // Esc 只关闭建议浮层，不影响页面其他部分。
    if (event.key === "Escape") {
      if (expanded) {
        event.preventDefault();
        onOpenChange(false);
        onActiveIndexChange(-1);
      }
      return;
    }

    // Tab 离开搜索区域时收起浮层，让焦点正常移到下一个控件。
    if (event.key === "Tab") {
      onOpenChange(false);
      onActiveIndexChange(-1);
    }
  };

  // 点击建议项：把用户名填回输入框，并立即按该用户名筛选。
  const handleSuggestionPick = (user: AdminUser) => {
    onApply(user.name);
  };

  return (
    <div className={styles.search} ref={containerRef}>
      <div className={styles.field}>
        <input
          aria-activedescendant={
            expanded && activeIndex >= 0
              ? `${listId}-option-${suggestions[activeIndex]?.id}`
              : undefined
          }
          aria-autocomplete="list"
          aria-controls={expanded ? listId : undefined}
          aria-expanded={expanded}
          aria-label="搜索用户名或邮箱"
          autoComplete="off"
          className={styles.input}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => {
            if (query.trim() && hasSuggestions) {
              onOpenChange(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="搜索用户名 / 邮箱"
          role="combobox"
          spellCheck={false}
          type="text"
          value={query}
        />
        <button
          aria-label="搜索"
          className={styles.iconButton}
          onClick={() => {
            onApply(query);
          }}
          /* 保持输入框焦点，点击按钮时不会先触发输入框 blur 把浮层收起。 */
          onMouseDown={(event) => event.preventDefault()}
          type="button"
        >
          <SearchIcon />
        </button>
      </div>

      {/* 建议浮层绝对定位覆盖在表格上方，不推挤页面布局；最多展示 SUGGESTION_LIMIT 条 */}
      {expanded ? (
        <ul
          aria-label="用户搜索建议"
          className={styles.suggestions}
          id={listId}
          role="listbox"
        >
          {suggestions.map((user, index) => (
            <li
              aria-selected={index === activeIndex}
              className={cn(
                styles.suggestion,
                index === activeIndex && styles.suggestionActive,
              )}
              id={`${listId}-option-${user.id}`}
              key={user.id}
              onClick={() => handleSuggestionPick(user)}
              /* 阻止 mousedown 抢焦点，保证点击建议项时输入框仍保持聚焦。 */
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => onActiveIndexChange(index)}
              role="option"
            >
              {user.name}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
