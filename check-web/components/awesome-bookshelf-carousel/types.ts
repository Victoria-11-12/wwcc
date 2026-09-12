/**
 * 书架轮播组件使用的数据模型。
 *
 * 这里只描述数据类型，不包含运行时逻辑；页面、Hooks 和工具函数共用这些类型。
 */

/** 书脊材质：布料、皮革、亚麻或硬纸板。 */
export type BookTexture = "cloth" | "leather" | "linen" | "boards";

/** 一本书在书架轮播组件中需要使用的数据。 */
export type BookCard = {
  /** 书籍的唯一标识，用于 React 渲染和定位。 */
  id: number;

  /** 书名，会显示在书脊和详情区域中。 */
  title: string;

  /** 作者名称，可以不提供。 */
  author?: string;

  /** 书籍分类，例如玄幻、悬疑或都市。 */
  genre?: string;

  /** 出版年份或作品年份，可以是字符串或数字。 */
  year?: string | number;

  /** 书籍简介，用于详情面板展示。 */
  blurb?: string;

  /** 书中的一句代表性文字，用于详情面板展示。 */
  quote?: string;

  /** 书脊主颜色，必须是 CSS 可以识别的颜色。 */
  spineColor: string;

  /** 渐变的第二颜色；未提供时根据 `spineColor` 自动计算。 */
  spineColorB?: string;

  /** 书脊材质；未提供时按书籍索引自动分配。 */
  texture?: BookTexture;

  /** 封面图片地址；当前书架视图不一定使用。 */
  imageUrl?: string;

  /** 点击当前已选中书时的回调；未提供则使用组件的 `onBookClick`。 */
  onClick?: (card: BookCard) => void;
};