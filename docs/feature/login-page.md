# 重构书架组件（AwesomeBookshelfCarousel）

## 目标

现在这个组件是**一个 1600 多行的文件**（`check-web/components/awesome-bookshelf-carousel/AwesomeBookshelfCarousel.tsx`），
里面堆了十几种功能。因为代码被工具压缩过，变量名全是 `t`、`n`、`i`、`d` 这种单字母，几乎没法改、没法维护。

这次要做的事：**把这个大文件拆成十几个小文件**，每个文件只负责一件事，名字看得懂。

> 注意：只做「拆分 + 重命名」，不改任何功能、不改任何样式。拆完的组件表现要和现在**完全一样**。

---

## 现在的文件是什么样

```
components/awesome-bookshelf-carousel/
├── AwesomeBookshelfCarousel.tsx   ← 1600 行，所有东西都挤在这里
└── awesome-bookshelf-carousel.css  ← 样式（变量 + 动画，基本不用动）
```

那个 `.tsx` 文件里，其实已经有十几个 `function`，只是没拆出来。它们的名字也被压缩成了 `Pe`、`we`、`je` 这种。

---

## 拆完之后长什么样

```
components/awesome-bookshelf-carousel/
├── index.ts                  ← 对外只导出一个东西：书架组件
├── BookshelfCarousel.tsx     ← 主容器（组装下面所有零件）
├── types.ts                  ← 数据类型（BookCard 等）
│
├── hooks/
│   ├── useBookshelfData.ts   ← 管「数据从哪来」
│   └── useCarousel.ts        ← 管「现在显示第几本书」
│
├── components/
│   ├── BookShelf.tsx         ← 书架（木板 + 侧板 + 一排书）
│   ├── BookSpine.tsx         ← 一根书脊（书架上的一本书）
│   ├── BookViewer.tsx        ← 中间那本放大的书
│   ├── BookDetailPanel.tsx   ← 点开书后的详情面板
│   ├── Backdrop.tsx          ← 背景（星空、灰尘、灯光）
│   ├── CarouselControls.tsx  ← 左右箭头 + 底部圆点
│   ├── LoadingState.tsx      ← 加载中画面
│   └── ErrorState.tsx        ← 出错 / 没书画面
│
└── utils.ts                  ← 小工具（算颜色等）
```

---

## 每个文件是干什么的

### 1. `types.ts` —— 数据类型

把「书」长什么样写清楚，别的文件都引用它。

现在文件最后已经有一份（`BookCard`、`BookTexture`），直接搬过去即可。

```ts
// 一本书
export type BookCard = {
  id: number;
  title: string;          // 书名
  author?: string;        // 作者
  genre?: string;         // 分类
  year?: string | number; // 年份
  blurb?: string;         // 简介
  quote?: string;         // 书里的一句话
  spineColor: string;     // 书脊颜色（比如 "#2b5876"）
  spineColorB?: string;   // 书脊第二色（做渐变）
  texture?: "cloth" | "leather" | "linen" | "boards"; // 书的质感
  imageUrl?: string;      // 封面图
};
```

### 2. `hooks/useBookshelfData.ts` —— 数据从哪来

对应现在文件里的 `ve` 函数。

作用：决定「书」是从写死的数据来，还是从网络接口拉。

- 传入：`data`（写死的数据）或 `apiEndpoint`（网络地址）
- 返回三个东西：`books`（书的列表）、`loading`（是不是还在加载）、`error`（有没有出错）

### 3. `hooks/useCarousel.ts` —— 现在显示第几本

对应现在 `Pe` 函数里那一大段 `useState` 和 `useEffect`。

作用：管理「轮播」这件事，也就是：

- 当前是第几本书（`activeIdx`）
- 自动翻页（每隔几秒换一本）
- 按键盘左右键翻页
- 点某本书跳到那一本

把这一大堆状态逻辑抽出来，主容器就干净了。

### 4. `BookshelfCarousel.tsx` —— 主容器

对应现在的 `Pe` 函数。

这是对外的大组件，负责：把上面两个 hook 拿到的数据，传给下面的各个视图组件，拼成完整页面。

它的结构大致是（用文字描述）：

```
<div 全屏容器>
  <Backdrop />            ← 背景
  <BookViewer />          ← 中间放大的书
  <BookShelf />           ← 底部书架
  <CarouselControls />    ← 箭头和圆点
</div>
```

### 5. `components/BookShelf.tsx` —— 书架

对应现在的 `je` + `Ee` + `ae`。

书架 = 一条木板 + 两块侧板 + 一排书脊。它接收书的列表，把每本书渲染成一根 `BookSpine` 排在一起。

### 6. `components/BookSpine.tsx` —— 一根书脊

对应现在的 `ke` 和 `Se`。

书架上的一本书（只露出书脊那一条）。鼠标移上去会稍微转一下。

### 7. `components/BookViewer.tsx` —— 中间放大的书

对应现在的 `we`。

页面上方那本大书，展示当前选中书的封面。

### 8. `components/BookDetailPanel.tsx` —— 详情面板

对应现在的 `Se`（书名、作者、简介、引言那部分）。

### 9. `components/Backdrop.tsx` —— 背景

对应现在的 `Re` + `Te`。

星空、飘的灰尘、灯光这些装饰，纯背景，不参与交互。

### 10. `components/CarouselControls.tsx` —— 左右箭头 + 圆点

对应现在的 `_e`。

底部的「上一个 / 下一个」箭头，和一排表示「第几本」的小圆点。

### 11. `components/LoadingState.tsx` —— 加载中

对应现在的 `Ie`。就是那个转圈圈 + "LOADING"。

### 12. `components/ErrorState.tsx` —— 出错 / 没书

对应现在的 `ie`。出错或没有书时显示的提示。

### 13. `utils.ts` —— 小工具

对应现在的 `$e`（判断颜色深浅之类的纯函数）和 `ye`（算每本书几何尺寸的纯函数）。

都是「输入什么 → 输出什么」的函数，不碰界面。

### 14. `index.ts` —— 对外出口

别的页面要用书架，只从这里导入：

```ts
export { AwesomeBookshelfCarousel } from "./BookshelfCarousel";
export type { BookCard, BookTexture } from "./types";
```

这样 `login/page.tsx` 里现有的 `import { AwesomeBookshelfCarousel, BookCard }` 就不用改。

---

## 怎么拆（建议的顺序）

1. **先拆 `types.ts`** —— 最简单，把类型搬过去。
2. **再拆 `utils.ts`** —— 把纯函数搬过去，不涉及界面。
3. **拆两个 hook** —— `useBookshelfData`、`useCarousel`。
4. **拆视图组件** —— 从最简单的 `LoadingState`、`ErrorState` 开始，再到 `Backdrop`、`CarouselControls`，最后 `BookShelf`、`BookSpine`、`BookViewer`、`BookDetailPanel`。
5. **最后重组 `BookshelfCarousel.tsx`** —— 用上面所有零件拼起来。
6. **写 `index.ts`**，确认 `login/page.tsx` 不用改就能跑。

每拆完一个，都启动项目到 `/login` 页面看一眼，确认没坏再拆下一个。

---

## 几个要注意的地方

- **样式都是写在 JSX 里的 `style={{...}}`**，不是 CSS 类。拆分时把每个组件自己的 `style` 原样带过去就行。
- **颜色很多用的是 CSS 变量**（比如 `var(--bg)`、`var(--wood-dark)`），这些变量定义在 `awesome-bookshelf-carousel.css` 里，**不要动那个 CSS 文件**。
- **保持功能完全一致**：自动翻页、键盘左右键、点击书、hover 效果，一个都不能少。
- 拆完后，删掉原来那个 1600 行的大文件。
