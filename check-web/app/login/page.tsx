// 该页面使用了带交互回调的组件，需声明为客户端组件
"use client";

// 引入书架轮播组件及其样式；BookCard 为书本数据的类型
import { AwesomeBookshelfCarousel, type BookCard } from "@/components/awesome-bookshelf-carousel";
import "@/components/awesome-bookshelf-carousel/awesome-bookshelf-carousel.css";

// 书架数据，字段含义见 BookCard 类型
const books: BookCard[] = [
  {
    id: 1,
    title: "A Wild Sea",
    author: "E. King",
    genre: "Adventure",
    year: 2024,
    blurb: "A tight story about storms and survival.",
    quote: "The sea never bargains.",
    spineColor: "#2b5876",
    spineColorB: "#4e4376",
    texture: "cloth",
    imageUrl: "https://example.com/cover-1.jpg",
  },
];

export default function Login() {
  return (
    <AwesomeBookshelfCarousel
      data={books} // 书本列表
      shelfHeight={260} // 书架高度（像素）
      spineMinWidth={44} // 书脊最小宽度（像素）
      spineMaxWidth={72} // 书脊最大宽度（像素）
      autoInterval={4200} // 自动轮播间隔（毫秒）
      onBookClick={(book) => console.log("book", book)} // 点击书本时触发
      onBookChange={(index, book) => console.log("active", index, book)} // 当前书本变化时触发
    />
  );
}
