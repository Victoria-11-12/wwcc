import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div>Home Page</div>
      <Link href="/login">登录</Link>
      <Link href="/register">注册</Link>
      <Link href="/check">查重</Link>
      <Link href="/admin">管理</Link>
    </div>
  );
}
