import Link from "next/link";

import styles from "./CheckHeader.module.css";

export interface CheckUser {
  avatarText: string; // 圆形头像中显示的数字。
  name: string; // 页头中显示的用户名。
}

interface CheckHeaderProps {
  user?: CheckUser | null; // 没有用户信息时按未登录状态显示。
}

export default function CheckHeader({ user = null }: CheckHeaderProps) {
  return (
    <header className={styles.header}>
      {/* 用同一个 user 值决定页头内容，避免头像和用户名只显示一部分。 */}
      {user ? (
        /* 已登录时显示圆形数字头像和用户名。 */
        <div className={styles.userInfo} aria-label={`当前用户：${user.name}`}>
          {/* 数字头像属于装饰信息，读屏用户只需要听到用户名。 */}
          <span className={styles.avatar} aria-hidden="true">
            {user.avatarText}
          </span>
          <span className={styles.userName}>{user.name}</span>
        </div>
      ) : (
        /* 未登录时显示登录和注册入口。 */
        <nav className={styles.accountLinks} aria-label="账户">
          <Link className={styles.accountLink} href="/login">
            登录
          </Link>
          <Link className={styles.accountLink} href="/register">
            注册
          </Link>
        </nav>
      )}
    </header>
  );
}
