import styles from "./BookSelector.module.css";

// 冒号后面的字符串组成分类可选值，避免代码中出现其他错误分类名。
export type BookCategory = "起点中文网" | "番茄小说网" | "其它";

interface BookSelectorProps {
  activeCategory: BookCategory | null; // 当前展开的分类，不代表已经选中书籍。
  selectedBook: string | null; // 已经选中的具体书名。
  onCategoryClick: (category: BookCategory) => void; // 点击分类时更新展开状态。
  onBookSelect: (book: string) => void; // 点击书籍时完成单选。
}

// 当前版本使用设计稿中的三个书籍分类。
const BOOK_CATEGORIES: BookCategory[] = [
  "起点中文网",
  "番茄小说网",
  "其它",
];

// 每个分类只显示设计稿中列出的书籍。
export const BOOK_OPTIONS: Record<BookCategory, string[]> = {
  起点中文网: ["诡秘之主", "道诡异仙"],
  番茄小说网: ["十日终焉", "我在精神病院学斩神"],
  其它: ["龙族"],
};

// 从分类数据中整理出所有可搜索书籍，避免搜索框和下拉使用不同书籍。
export const EXAMPLE_BOOKS = Object.values(BOOK_OPTIONS).flat();

export default function BookSelector({
  activeCategory,
  selectedBook,
  onCategoryClick,
  onBookSelect,
}: BookSelectorProps) {
  return (
    <div className={styles.row}>
      <h2 className={styles.heading}>对标书籍</h2>

      {/* 有已选书时显示书名；没有选书时才显示分类按钮。 */}
      {selectedBook ? (
        /* 选择书籍后，用具体书名替换三个分类按钮。 */
        <div className={styles.selectedBook}>{selectedBook}</div>
      ) : (
        <div className={styles.categoryList} aria-label="对标书籍分类">
          {BOOK_CATEGORIES.map((category) => (
            /* 每个分类单独定位，下拉层会与当前按钮左边缘对齐。 */
            <div className={styles.categoryItem} key={category}>
              {/* 蓝色样式、展开状态和下拉入口使用同一个分类值判断。 */}
              <button
                className={styles.categoryButton}
                type="button"
                data-active={activeCategory === category}
                aria-expanded={activeCategory === category}
                aria-haspopup="listbox"
                onClick={() => onCategoryClick(category)}
              >
                {category}
              </button>

              {/* 只有当前激活分类匹配时，才在这个按钮下方渲染下拉选项。 */}
              {activeCategory === category ? (
                /* 下拉层覆盖搜索框，不改变其他区域的位置。 */
                <div
                  className={styles.dropdown}
                  role="listbox"
                  aria-label={`${category}书籍`}
                >
                  {BOOK_OPTIONS[category].map((book) => (
                    /* 点击书名后交给 CheckForm 保存为唯一选中的书籍。 */
                    <button
                      className={styles.bookOption}
                      type="button"
                      role="option"
                      aria-selected={selectedBook === book}
                      key={book}
                      onClick={() => onBookSelect(book)}
                    >
                      {book}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
