"use client";

import { Search } from "lucide-react";
import { useState, type ReactNode } from "react";

import { EXAMPLE_BOOKS } from "@/components/check/BookSelector";

import styles from "./BookSearch.module.css";

interface BookSearchProps {
  query: string; // 当前搜索关键词。
  onQueryChange: (query: string) => void; // 输入关键词时同步给表单状态。
  onBookSelect: (book: string) => void; // 点击建议书籍时完成单选。
  onSearchFocus: () => void; // 开始搜索时关闭分类下拉。
}

// 把与关键词匹配的文字标记成蓝色，其余文字保持原样。
function highlightMatch(text: string, query: string): ReactNode {
  const keyword = query.trim();

  // 先找到关键词第一次出现的位置，不区分英文字母大小写。
  const matchIndex = text
    .toLocaleLowerCase()
    .indexOf(keyword.toLocaleLowerCase());

  if (!keyword || matchIndex < 0) {
    return text;
  }

  // 把书名拆成“关键词前、关键词、关键词后”三部分。
  const matchEnd = matchIndex + keyword.length;

  return (
    <>
      {text.slice(0, matchIndex)}
      <mark className={styles.match}>{text.slice(matchIndex, matchEnd)}</mark>
      {text.slice(matchEnd)}
    </>
  );
}

export default function BookSearch({
  query,
  onQueryChange,
  onBookSelect,
  onSearchFocus,
}: BookSearchProps) {
  // 建议浮层是否打开；搜索词为空时即使打开也不会显示内容。
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const keyword = query.trim();

  // 书名中包含关键词即可匹配，例如输入“精神”可以找到“我在精神病院学斩神”。
  // 统一转成小写后再比较，英文关键词也不会受大小写影响。
  const matchingBooks = keyword
    ? EXAMPLE_BOOKS.filter((book) =>
        book.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()),
      )
    : [];

  function handleInputChange(value: string) {
    onQueryChange(value);
    // 输入关键词后立即展示匹配建议。
    setIsSuggestionsOpen(value.trim().length > 0);
  }

  function handleSearch() {
    onSearchFocus();
    // 点击搜索按钮时，按当前关键词重新展示匹配结果。
    setIsSuggestionsOpen(keyword.length > 0);
  }

  return (
    <div className={styles.row}>
      {/* 放大镜图标放在输入框内部左侧。 */}
      <div
        className={styles.field}
        onBlur={(event) => {
          // 只有焦点离开整个搜索区域时才关闭建议，键盘 Tab 进入选项不会关闭。
          // relatedTarget 表示即将获得焦点的元素，可用于判断是否仍在建议列表内。
          const nextTarget = event.relatedTarget as Node | null;
          if (!event.currentTarget.contains(nextTarget)) {
            setIsSuggestionsOpen(false);
          }
        }}
      >
        {/* 图标只是装饰，屏幕阅读器会跳过它。 */}
        <Search className={styles.searchIcon} aria-hidden="true" />
        {/* 输入框和表单状态保持一致，输入内容始终由 CheckForm 保存。 */}
        <input
          className={styles.input}
          type="search"
          role="combobox"
          aria-label="搜索对标书籍"
          aria-autocomplete="list"
          aria-controls="book-search-suggestions"
          aria-expanded={
            isSuggestionsOpen && matchingBooks.length > 0
          }
          autoComplete="off"
          value={query}
          placeholder="请输入书名或作者名进行搜索..."
          onChange={(event) => handleInputChange(event.target.value)}
          onFocus={() => {
            onSearchFocus();
            if (keyword.length > 0) {
              setIsSuggestionsOpen(true);
            }
          }}
        />

        {isSuggestionsOpen && matchingBooks.length > 0 ? (
          /* 建议浮层覆盖下方内容，不会推动上传网文区域。 */
          <div
            className={styles.suggestions}
            id="book-search-suggestions"
            role="listbox"
            aria-label="搜索建议"
          >
            {matchingBooks.map((book) => (
              /* 每个匹配书名都是独立按钮，只有用户点击后才真正选书。 */
              <button
                className={styles.suggestionOption}
                type="button"
                role="option"
                key={book}
                onMouseDown={(event) => {
                  // 防止输入框先失焦，导致建议列表在点击完成前关闭。
                  // 阻止默认失焦后，鼠标点击仍能正常触发下面的 onClick。
                  event.preventDefault();
                }}
                onClick={() => onBookSelect(book)}
              >
                {highlightMatch(book, keyword)}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <button
        className={styles.searchButton}
        type="button"
        onClick={handleSearch}
      >
        搜索
      </button>
    </div>
  );
}
