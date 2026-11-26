import type { Metadata } from "next";
import AdminSidebar from "@/components/admin/AdminSidebar";
import UserManagement from "@/components/admin/UserManagement";
import styles from "./page.module.css";

/**
 * 后台管理页路由入口：/admin
 *
 * 这里只负责页面骨架和左右布局：
 * - 左侧：AdminSidebar（管理员信息 + 用户管理导航）
 * - 右侧：UserManagement（用户列表、搜索、新增、修改、删除、分页）
 *
 * 该文件是服务端组件；所有需要输入/点击的状态都在 UserManagement 中，
 * 那里通过 "use client" 声明为客户端组件。
 */
export const metadata: Metadata = {
  title: "用户管理 | 后台管理",
  description: "后台用户管理：查看、搜索、新增、修改与删除用户。",
};

export default function AdminPage() {
  return (
    <main className={styles.page}>
      <AdminSidebar />
      <UserManagement />
    </main>
  );
}
