export type BookTexture = "cloth" | "leather" | "linen" | "boards";

export type BookCard = {
  id: number;
  title: string;
  author?: string;
  genre?: string;
  year?: string | number;
  blurb?: string;
  quote?: string;
  spineColor: string;
  spineColorB?: string;
  texture?: BookTexture;
  imageUrl?: string;
  onClick?: (card: BookCard) => void;
};
