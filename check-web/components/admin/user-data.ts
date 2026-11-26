/**
 * 后台用户模块的共享类型、示例数据和纯函数。
 *
 * 当前没有后端接口，页面用 INITIAL_USERS 作为初始数据；
 * 以后接入接口时，保留 AdminUser 结构，替换 UserManagement 里的
 * users 初始化逻辑即可，表格/搜索/弹窗都不需要改。
 */
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

/** 新增用户时可选择的角色，顺序与下拉框一致。 */
export const ROLES: UserRole[] = ["用户", "管理员"];

/** 每页显示的条数；分页页数由用户总数动态计算，不写死。 */
export const PAGE_SIZE = 6;

/** 搜索建议最多展示的条数，避免浮层过高遮挡表格。 */
export const SUGGESTION_LIMIT = 6;

/** 示例用户的注册时间，只用于还原设计稿画面。 */
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

/**
 * 把 Date 格式化为表格里显示的 “YYYY-MM-DD HH:mm”。
 * 新增用户时用它生成注册时间。
 */
export function formatDateTime(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");

  return [
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  ].join(" ");
}

/**
 * 计算下一个用户序号：当前最大 id + 1。
 * 这样删除用户后新增，不会复用被删掉的序号。
 */
export function nextUserId(users: AdminUser[]): number {
  return users.reduce((maxId, user) => Math.max(maxId, user.id), 0) + 1;
}

/**
 * 搜索匹配规则：用户名或邮箱包含关键词即可（忽略大小写）。
 * 空关键词视为不过滤，返回完整列表。
 */
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
