import Link from "next/link";
import styles from "./AdminSidebar.module.css";

function HomeIcon() {
  return (
    <svg
      className={styles.navIcon}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m3 10.4 9-7.1 9 7.1" />
      <path d="M5.2 9.3V20a1 1 0 0 0 1 1h3.9v-5.8h3.8V21h3.9a1 1 0 0 0 1-1V9.3" />
    </svg>
  );
}

export default function AdminSidebar() {
  return (
    <aside className={styles.sidebar} aria-label="后台侧边栏">
      <div className={styles.profile}>
        <span className={styles.avatar} aria-hidden="true">
          1
        </span>
        <div className={styles.profileText}>
          <p className={styles.name}>用户名1</p>
          <p className={styles.role}>管理员</p>
        </div>
      </div>

      <nav className={styles.nav} aria-label="后台导航">
        <Link
          className={styles.navLink}
          href="/admin"
          aria-current="page"
        >
          <HomeIcon />
          <span>用户管理</span>
        </Link>
      </nav>
    </aside>
  );
}
