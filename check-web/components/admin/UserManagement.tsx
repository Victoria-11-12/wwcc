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

interface ToastState {
  id: number;
  message: string;
  tone: "success" | "error";
}

export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>(() => [...INITIAL_USERS]);
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const toastSequence = useRef(0);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const deleteTriggerRef = useRef<HTMLButtonElement | null>(null);

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
    deleteTriggerRef.current = trigger;
    setDeleteTarget(user);
  };

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
            ref={addButtonRef}
            onClick={handleOpenAddDialog}
          >
            新增用户
          </button>
        </div>

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

      {addDialogOpen ? (
        <UserFormDialog
          onCancel={() => setAddDialogOpen(false)}
          onSubmit={handleAddUser}
        />
      ) : null}

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
