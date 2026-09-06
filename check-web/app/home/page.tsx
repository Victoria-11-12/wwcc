'use client';

import Dock from "@/components/Dock";
import { useRouter } from "next/navigation";

export default function Home() {
  // 路由跳转
  const router = useRouter();

  // Dock 按钮配置：文字 + 点击跳转路径
  const items = [
    { label: "登录", onClick: () => router.push("/login") },
    { label: "注册", onClick: () => router.push("/register") },
    { label: "查重", onClick: () => router.push("/check") },
    { label: "管理", onClick: () => router.push("/admin") },
  ];

  return (
    <div>
      <Dock items={items} />
    </div>
  );
}
