import type { BookCard, BookTexture } from "./types";

/**
 * 一本书在书架中计算后的几何数据和背景样式。
 */
export type BookGeometry = {
  /** 书脊最终宽度。 */
  width: number;

  /** 书脊最终高度。 */
  height: number;

  /** 最终使用的书脊材质。 */
  texture: BookTexture;

  /** 书脊使用的渐变和纹理背景 CSS。 */
  bgCss: string;
};

/** 根据种子生成稳定的 0~1 伪随机数，保证同一本书每次渲染的纹理一致。 */
function seededRandom(seed: number) {
  const value = Math.sin(seed * 84.3 + 193.7) * 39182.5;
  return value - Math.floor(value);
}

/** 把 `#RRGGBB` 十六进制颜色转换成 RGB 数值。 */
function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

/** 按比例调暗颜色，并返回十六进制颜色。 */
function darkenHex(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex);
  const factor = 1 - amount;
  return `#${[r, g, b]
    .map((channel) =>
      Math.max(0, Math.round(channel * factor))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

/** 按比例调亮颜色，并返回十六进制颜色。 */
function lightenHex(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex);
  return `#${[r, g, b]
    .map((channel) =>
      Math.min(255, Math.round(channel + (255 - channel) * amount))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

/** 根据书籍索引循环选择四种书脊材质。 */
function getTextureForIndex(index: number): BookTexture {
  const textures: BookTexture[] = ["cloth", "leather", "linen", "boards"];
  return textures[index % textures.length];
}

/**
 * 根据书脊颜色、材质和索引生成背景 CSS。
 * 返回内容同时包含颜色渐变和对应材质的内嵌 SVG 纹理。
 */
function createBookBackground(
  spineColor: string,
  spineColorB: string | undefined,
  texture: BookTexture,
  index: number,
) {
  // 根据主颜色计算渐变需要的深浅颜色。
  const dark = darkenHex(spineColor, 0.3),
    light = lightenHex(spineColor, 0.12),
    slightlyDark = darkenHex(spineColor, 0.12),
    secondary = spineColorB ?? dark,
    // 不同材质使用不同的渐变方向与光暗分布。
    gradient = (() => {
      switch (texture) {
        case "cloth":
          return `linear-gradient(175deg, ${light} 0%, ${spineColor} 35%, ${slightlyDark} 65%, ${dark} 100%)`;
        case "leather":
          return `radial-gradient(ellipse 120% 80% at 40% 20%, ${light} 0%, ${spineColor} 40%, ${dark} 100%)`;
        case "linen":
          return `linear-gradient(180deg, ${slightlyDark} 0%, ${light} 20%, ${spineColor} 50%, ${slightlyDark} 80%, ${dark} 100%)`;
        case "boards":
          return `linear-gradient(180deg, ${light} 0%, ${spineColor} 30%, ${secondary} 70%, ${dark} 100%)`;
      }
    })();

  return `${(() => {
    // 使用索引生成稳定种子，让每本书的纹理细节不会随机跳动。
    const seed = index * 17;
    switch (texture) {
      case "cloth": {
        // 布料：交叉细线模拟织物纹理。
        const opacity = 0.12 + seededRandom(seed) * 0.08,
          svg = `<svg xmlns='http://www.w3.org/2000/svg' width='6' height='6'><line x1='0' y1='6' x2='6' y2='0' stroke='rgba(255,255,255,${opacity.toFixed(2)})' stroke-width='0.8'/><line x1='-1' y1='1' x2='1' y2='-1' stroke='rgba(255,255,255,${(opacity * 0.6).toFixed(2)})' stroke-width='0.5'/><line x1='5' y1='7' x2='7' y2='5' stroke='rgba(255,255,255,${(opacity * 0.6).toFixed(2)})' stroke-width='0.5'/></svg>`;
        return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
      }
      case "leather": {
        // 皮革：随机圆点模拟皮革表面的颗粒。
        const opacity = 0.08 + seededRandom(seed * 2) * 0.06,
          radius = 0.6 + seededRandom(seed * 3) * 0.4,
          svg = `<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8'><circle cx='2' cy='2' r='${radius}' fill='rgba(0,0,0,${opacity})'/><circle cx='6' cy='6' r='${radius * 0.7}' fill='rgba(0,0,0,${opacity * 0.7})'/><circle cx='2' cy='6' r='${radius * 0.5}' fill='rgba(255,255,255,${opacity * 0.4})'/></svg>`;
        return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
      }
      case "linen": {
        // 亚麻：横向明暗线模拟纤维纹路。
        const opacity = 0.1 + seededRandom(seed * 4) * 0.06,
          svg = `<svg xmlns='http://www.w3.org/2000/svg' width='4' height='4'><line x1='0' y1='1' x2='4' y2='1' stroke='rgba(255,255,255,${opacity.toFixed(2)})' stroke-width='0.6'/><line x1='0' y1='3' x2='4' y2='3' stroke='rgba(0,0,0,${(opacity * 0.5).toFixed(2)})' stroke-width='0.4'/></svg>`;
        return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
      }
      case "boards": {
        // 硬纸板：纵向明暗线模拟纸板压纹。
        const opacity = 0.1 + seededRandom(seed * 5) * 0.07,
          svg = `<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><line x1='3' y1='0' x2='3' y2='10' stroke='rgba(0,0,0,${opacity.toFixed(2)})' stroke-width='0.7'/><line x1='7' y1='0' x2='7.5' y2='10' stroke='rgba(255,255,255,${(opacity * 0.5).toFixed(2)})' stroke-width='0.5'/></svg>`;
        return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
      }
    }
  })()}, ${gradient}`;
}

/** 根据书籍索引返回高度比例，使书脊高度有稳定的高低变化。 */
function getHeightScale(index: number) {
  return 0.72 + seededRandom(index * 7 + 3) * 0.28;
}

/** 根据书籍索引返回宽度比例，使书脊宽度有稳定的宽窄变化。 */
function getWidthScale(index: number) {
  return 0.3 + seededRandom(index * 11 + 5) * 0.7;
}

/**
 * 计算每本书最终的宽度、高度、材质和背景。
 * 这是纯函数：相同输入始终得到相同结果，不依赖 React 或 DOM。
 */
export function getBookGeometry(
  books: BookCard[],
  shelfHeight: number,
  spineMinWidth: number,
  spineMaxWidth: number,
): BookGeometry[] {
  return books.map((book, index) => {
    // 优先使用书籍自身材质，没有时根据索引自动分配。
    const texture = book.texture ?? getTextureForIndex(index),
      // 在最小和最大宽度之间，根据稳定比例计算最终宽度。
      width = spineMinWidth + getWidthScale(index) * (spineMaxWidth - spineMinWidth),
      // 根据书架高度和稳定比例计算最终高度。
      height = Math.round(shelfHeight * getHeightScale(index)),
      // 同时生成渐变和纹理背景。
      bgCss = createBookBackground(book.spineColor, book.spineColorB, texture, index);
    return { width, height, texture, bgCss };
  });
}

/** 根据人眼亮度权重判断颜色是否偏暗。 */
export function isDarkColor(hex: string) {
  const value = hex.replace("#", ""),
    red = parseInt(value.slice(0, 2), 16),
    green = parseInt(value.slice(2, 4), 16),
    blue = parseInt(value.slice(4, 6), 16);
  return 0.299 * red + 0.587 * green + 0.114 * blue < 128;
}