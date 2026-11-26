import type { Metadata } from "next";
import AdminSidebar from "@/components/admin/AdminSidebar";
import UserManagement from "@/components/admin/UserManagement";
import styles from "./page.module.css";

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
