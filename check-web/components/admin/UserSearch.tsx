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
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const hasSuggestions = suggestions.length > 0;
  const expanded = open && hasSuggestions;

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

    if (event.key === "Enter") {
      event.preventDefault();

      if (expanded && activeIndex >= 0 && suggestions[activeIndex]) {
        onApply(suggestions[activeIndex].name);
        return;
      }

      onApply(query);
      return;
    }

    if (event.key === "Escape") {
      if (expanded) {
        event.preventDefault();
        onOpenChange(false);
        onActiveIndexChange(-1);
      }
      return;
    }

    if (event.key === "Tab") {
      onOpenChange(false);
      onActiveIndexChange(-1);
    }
  };

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
          ref={inputRef}
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
          onMouseDown={(event) => event.preventDefault()}
          type="button"
        >
          <SearchIcon />
        </button>
      </div>

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
