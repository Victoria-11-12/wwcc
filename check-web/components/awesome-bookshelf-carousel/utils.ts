import type { BookCard, BookTexture } from "./types";

export type BookGeometry = {
  width: number;
  height: number;
  texture: BookTexture;
  bgCss: string;
};

function seededRandom(seed: number) {
  const value = Math.sin(seed * 84.3 + 193.7) * 39182.5;
  return value - Math.floor(value);
}

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

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

function getTextureForIndex(index: number): BookTexture {
  const textures: BookTexture[] = ["cloth", "leather", "linen", "boards"];
  return textures[index % textures.length];
}

function createBookBackground(
  spineColor: string,
  spineColorB: string | undefined,
  texture: BookTexture,
  index: number,
) {
  const dark = darkenHex(spineColor, 0.3),
    light = lightenHex(spineColor, 0.12),
    slightlyDark = darkenHex(spineColor, 0.12),
    secondary = spineColorB ?? dark,
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
    const seed = index * 17;
    switch (texture) {
      case "cloth": {
        const opacity = 0.12 + seededRandom(seed) * 0.08,
          svg = `<svg xmlns='http://www.w3.org/2000/svg' width='6' height='6'><line x1='0' y1='6' x2='6' y2='0' stroke='rgba(255,255,255,${opacity.toFixed(2)})' stroke-width='0.8'/><line x1='-1' y1='1' x2='1' y2='-1' stroke='rgba(255,255,255,${(opacity * 0.6).toFixed(2)})' stroke-width='0.5'/><line x1='5' y1='7' x2='7' y2='5' stroke='rgba(255,255,255,${(opacity * 0.6).toFixed(2)})' stroke-width='0.5'/></svg>`;
        return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
      }
      case "leather": {
        const opacity = 0.08 + seededRandom(seed * 2) * 0.06,
          radius = 0.6 + seededRandom(seed * 3) * 0.4,
          svg = `<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8'><circle cx='2' cy='2' r='${radius}' fill='rgba(0,0,0,${opacity})'/><circle cx='6' cy='6' r='${radius * 0.7}' fill='rgba(0,0,0,${opacity * 0.7})'/><circle cx='2' cy='6' r='${radius * 0.5}' fill='rgba(255,255,255,${opacity * 0.4})'/></svg>`;
        return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
      }
      case "linen": {
        const opacity = 0.1 + seededRandom(seed * 4) * 0.06,
          svg = `<svg xmlns='http://www.w3.org/2000/svg' width='4' height='4'><line x1='0' y1='1' x2='4' y2='1' stroke='rgba(255,255,255,${opacity.toFixed(2)})' stroke-width='0.6'/><line x1='0' y1='3' x2='4' y2='3' stroke='rgba(0,0,0,${(opacity * 0.5).toFixed(2)})' stroke-width='0.4'/></svg>`;
        return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
      }
      case "boards": {
        const opacity = 0.1 + seededRandom(seed * 5) * 0.07,
          svg = `<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><line x1='3' y1='0' x2='3' y2='10' stroke='rgba(0,0,0,${opacity.toFixed(2)})' stroke-width='0.7'/><line x1='7' y1='0' x2='7.5' y2='10' stroke='rgba(255,255,255,${(opacity * 0.5).toFixed(2)})' stroke-width='0.5'/></svg>`;
        return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
      }
    }
  })()}, ${gradient}`;
}

function getHeightScale(index: number) {
  return 0.72 + seededRandom(index * 7 + 3) * 0.28;
}

function getWidthScale(index: number) {
  return 0.3 + seededRandom(index * 11 + 5) * 0.7;
}

export function getBookGeometry(
  books: BookCard[],
  shelfHeight: number,
  spineMinWidth: number,
  spineMaxWidth: number,
): BookGeometry[] {
  return books.map((book, index) => {
    const texture = book.texture ?? getTextureForIndex(index),
      width = spineMinWidth + getWidthScale(index) * (spineMaxWidth - spineMinWidth),
      height = Math.round(shelfHeight * getHeightScale(index)),
      bgCss = createBookBackground(book.spineColor, book.spineColorB, texture, index);
    return { width, height, texture, bgCss };
  });
}

export function isDarkColor(hex: string) {
  const value = hex.replace("#", ""),
    red = parseInt(value.slice(0, 2), 16),
    green = parseInt(value.slice(2, 4), 16),
    blue = parseInt(value.slice(4, 6), 16);
  return 0.299 * red + 0.587 * green + 0.114 * blue < 128;
}