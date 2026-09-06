'use client';

import Dock from "@/components/Dock";
import Galaxy from "@/components/Galaxy";
import TrueFocus from "@/components/TrueFocus";
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
    <div className="relative h-screen w-full overflow-hidden">
      {/* 星空背景，铺满全屏 */}
      <div className="absolute inset-0">
        <Galaxy transparent={false} />
      </div>
      {/* 标题：四个名字聚焦轮播，居中显示 */}
      <div className="absolute inset-0 flex items-center justify-center text-white">
        <TrueFocus
          sentence="小光 小浩 小霍 小成"
          borderColor="blue"
          glowColor="rgba(0, 0, 255, 0.6)"
        />
      </div>
      {/* Dock 浮动在底部 */}
      <Dock items={items} />
    </div>
  );
}
