"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import DeleteUserDialog from "@/components/admin/DeleteUserDialog";
import OperationToast from "@/components/admin/OperationToast";
import UserFormDialog, {
  type NewUserInput,
} from "@/components/admin/UserFormDialog";
import UserSearch from "@/components/admin/UserSearch";
import UserTable from "@/components/admin/UserTable";
import {
  INITIAL_USERS,
  PAGE_SIZE,
  SUGGESTION_LIMIT,
  formatDateTime,
  matchesKeyword,
  nextUserId,
  type AdminUser,
} from "@/components/admin/user-data";
import styles from "./UserManagement.module.css";

/** 顶部提示条的状态：id 用于重新触发计时，tone 决定成功/失败样式。 */
interface ToastState {
  id: number;
  message: string;
  tone: "success" | "error";
}

/**
 * 后台用户管理主容器（客户端组件）。
 *
 * 数据流：
 * users（唯一数据源）
 *   → 按 appliedQuery 过滤得到 filteredUsers
 *   → 按 PAGE_SIZE 切出当前页 pageUsers
 *   → 交给 UserTable 渲染
 *
 * 搜索为什么要区分 query 和 appliedQuery：
 * - query：输入框实时值，只用来显示建议；
 * - appliedQuery：点击建议、点击放大镜或按 Enter 后才更新，真正参与表格筛选。
 * 这样输入过程中表格不会来回跳，清空输入时则立即恢复完整列表。
 *
 * 交互协调：
 * - 搜索建议、新增弹窗、删除确认不会同时打开；
 * - 行内编辑只允许修改用户名；
 * - 增删改的结果统一通过顶部提示条反馈，提示 2.6 秒后自动消失。
 *
 * 更完整的模块说明见同目录 README.md。
 */
export default function UserManagement() {
  // 用户数据：当前用示例数据初始化；接入后端时只需替换这里的初始值和增删改请求。
  const [users, setUsers] = useState<AdminUser[]>(() => [...INITIAL_USERS]);

  // 搜索：query 是输入框显示值，appliedQuery 是真正参与筛选的关键词。
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");

  // 分页与行内编辑：editingId 记录当前正在改用户名的那一行。
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);

  // 弹窗与提示：deleteTarget 不为空时显示删除确认框。
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  // toastSequence 保证同一句提示重复出现时也能重新触发计时。
  const toastSequence = useRef(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const deleteTriggerRef = useRef<HTMLButtonElement | null>(null);

  // 派生数据：先按已应用的关键词筛选，再切出当前页；页码不会超过实际页数。
  const filteredUsers = useMemo(
    () => users.filter((user) => matchesKeyword(user, appliedQuery)),
    [users, appliedQuery],
  );

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageUsers = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // 搜索建议只匹配用户名，并限制展示条数；真正的筛选范围仍然包括邮箱。
  const suggestions = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    if (!keyword) {
      return [];
    }

    return users
      .filter((user) => user.name.toLowerCase().includes(keyword))
      .slice(0, SUGGESTION_LIMIT);
  }, [query, users]);

  const showToast = useCallback(
    (message: string, tone: ToastState["tone"]) => {
      toastSequence.current += 1;
      setToast({ id: toastSequence.current, message, tone });
    },
    [],
  );

  // 提示条 2.6 秒后自动消失；如果期间又出现新提示，会重新开始计时。
  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => setToast(null), 2600);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const closeSuggestions = useCallback(() => {
    setSuggestionsOpen(false);
    setActiveSuggestion(-1);
  }, []);

  // 输入时不立即筛选：只更新输入值并打开建议。
  // 清空输入时特殊处理，立即恢复完整列表并回到第一页。
  const handleQueryChange = (value: string) => {
    setQuery(value);
    setActiveSuggestion(-1);

    if (!value.trim()) {
      setAppliedQuery("");
      setPage(1);
      setSuggestionsOpen(false);
      return;
    }

    setSuggestionsOpen(true);
  };

  // 三个筛选入口共用：点击建议项、点击放大镜、在输入框按 Enter。
  const applySearch = (value: string) => {
    setQuery(value);
    setAppliedQuery(value.trim());
    setPage(1);
    closeSuggestions();
  };

  const handleStartEdit = (id: number) => {
    closeSuggestions();
    setEditingId(id);
  };

  // 行内改名提交：空名称不覆盖原值，保留旧用户名并提示失败。
  const handleCommitEdit = (id: number, rawName: string) => {
    const name = rawName.trim();

    setEditingId(null);

    if (!name) {
      showToast("用户名不能为空", "error");
      return;
    }

    setUsers((previous) =>
      previous.map((user) => (user.id === id ? { ...user, name } : user)),
    );
  };

  const handleOpenAddDialog = () => {
    closeSuggestions();
    setEditingId(null);
    setAddDialogOpen(true);
  };

  // 新增用户：序号继续递增，注册时间取当前时间；密码只做校验，不进入列表数据。
  const handleAddUser = (input: NewUserInput) => {
    setUsers((previous) => {
      const newUser: AdminUser = {
        id: nextUserId(previous),
        name: input.name,
        role: input.role,
        email: input.email,
        createdAt: formatDateTime(new Date()),
      };

      return [...previous, newUser];
    });
    setAddDialogOpen(false);
    showToast("新增成功", "success");
  };

  const handleDeleteClick = (
    user: AdminUser,
    trigger: HTMLButtonElement,
  ) => {
    closeSuggestions();
    setEditingId(null);
    // 记住触发删除的按钮，取消弹窗时把焦点还回去。
    deleteTriggerRef.current = trigger;
    setDeleteTarget(user);
  };

  // 删除前先按“删除后的数据量”算页数，当前页被删空时自动退回上一页。
  const handleConfirmDelete = () => {
    if (!deleteTarget) {
      return;
    }

    const target = deleteTarget;
    const remainingCount = filteredUsers.filter(
      (user) => user.id !== target.id,
    ).length;
    const remainingPages = Math.max(
      1,
      Math.ceil(remainingCount / PAGE_SIZE),
    );

    setDeleteTarget(null);
    setUsers((previous) => previous.filter((user) => user.id !== target.id));
    setPage((previous) => Math.min(previous, remainingPages));
    showToast("删除成功", "success");

    // 被删除行的“删除”按钮已随行消失，把焦点交给页面标题，避免焦点丢到页面外。
    window.setTimeout(() => headingRef.current?.focus(), 0);
  };

  return (
    <section className={styles.management} aria-labelledby="admin-users-title">
      <h1
        className={styles.title}
        id="admin-users-title"
        ref={headingRef}
        tabIndex={-1}
      >
        用户管理
      </h1>

      <div className={styles.card}>
        {/* 工具栏：左侧搜索，右侧打开新增用户弹窗 */}
        <div className={styles.toolbar}>
          <UserSearch
            query={query}
            suggestions={suggestions}
            activeIndex={activeSuggestion}
            open={suggestionsOpen}
            onChange={handleQueryChange}
            onApply={applySearch}
            onOpenChange={setSuggestionsOpen}
            onActiveIndexChange={setActiveSuggestion}
          />
          <button
            className={styles.addButton}
            type="button"
            onClick={handleOpenAddDialog}
          >
            新增用户
          </button>
        </div>

        {/* 列表区只接收当前页数据；分页、行内编辑和删除按钮都通过回调交给本组件处理 */}
        <UserTable
          users={pageUsers}
          totalCount={filteredUsers.length}
          editingId={editingId}
          page={currentPage}
          totalPages={totalPages}
          onStartEdit={handleStartEdit}
          onCancelEdit={() => setEditingId(null)}
          onCommitEdit={handleCommitEdit}
          onDeleteClick={handleDeleteClick}
          onPageChange={(nextPage) =>
            setPage(Math.min(Math.max(nextPage, 1), totalPages))
          }
        />
      </div>

      {/* 新增弹窗只在打开时挂载，关闭即销毁，下次打开时表单自动回到初始值 */}
      {addDialogOpen ? (
        <UserFormDialog
          onCancel={() => setAddDialogOpen(false)}
          onSubmit={handleAddUser}
        />
      ) : null}

      {/* 删除弹窗：显示待删除的用户名，确认后按 user.id 精确删除 */}
      {deleteTarget ? (
        <DeleteUserDialog
          user={deleteTarget}
          onCancel={() => {
            setDeleteTarget(null);
            window.setTimeout(() => {
              if (deleteTriggerRef.current?.isConnected) {
                deleteTriggerRef.current.focus();
              }
            }, 0);
          }}
          onConfirm={handleConfirmDelete}
        />
      ) : null}

      {/* 操作结果提示：成功/失败共用同一个固定位置，2.6 秒后自动消失 */}
      {toast ? (
        <OperationToast
          key={toast.id}
          message={toast.message}
          tone={toast.tone}
        />
      ) : null}
    </section>
  );
}
