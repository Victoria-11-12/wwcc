export type UserRole = "用户" | "管理员";

export interface AdminUser {
  /** 稳定的用户序号，删除用户后不重新编号。 */
  id: number;
  name: string;
  role: UserRole;
  email: string;
  /** 展示用注册时间，格式为 YYYY-MM-DD HH:mm。 */
  createdAt: string;
}

export const ROLES: UserRole[] = ["用户", "管理员"];

export const PAGE_SIZE = 6;

/** 搜索建议最多展示的条数，避免浮层过高遮挡表格。 */
export const SUGGESTION_LIMIT = 6;

const SEED_CREATED_AT = [
  "2026-10-30 09:32",
  "2026-10-28 14:15",
  "2026-10-21 11:06",
  "2026-10-16 16:48",
  "2026-10-09 08:24",
  "2026-10-02 13:57",
  "2026-09-25 10:12",
  "2026-09-18 15:40",
  "2026-09-11 09:05",
  "2026-09-03 17:22",
  "2026-08-27 13:48",
];

/**
 * 示例数据用于还原设计稿画面，不代表正式数据。
 * 初始 11 条、每页 6 条，因此首屏显示 6 行且分页为 1、2 两页。
 */
export const INITIAL_USERS: AdminUser[] = SEED_CREATED_AT.map(
  (createdAt, index) => {
    const id = index + 1;

    return {
      id,
      name: `用户名${id}`,
      role: id === 1 ? "管理员" : "用户",
      email: `user${id}@example.com`,
      createdAt,
    };
  },
);

export function formatDateTime(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");

  return [
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  ].join(" ");
}

export function nextUserId(users: AdminUser[]): number {
  return users.reduce((maxId, user) => Math.max(maxId, user.id), 0) + 1;
}

export function matchesKeyword(user: AdminUser, keyword: string): boolean {
  const normalized = keyword.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  return (
    user.name.toLowerCase().includes(normalized) ||
    user.email.toLowerCase().includes(normalized)
  );
}
