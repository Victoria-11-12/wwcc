"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { AdminUser } from "@/components/admin/user-data";
import styles from "./UserTable.module.css";

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={direction === "left" ? "m14 6-6 6 6 6" : "m10 6 6 6-6 6"} />
    </svg>
  );
}

interface EditableUsernameProps {
  initialValue: string;
  onCommit: (value: string) => void;
  onCancel: () => void;
}

function EditableUsername({
  initialValue,
  onCommit,
  onCancel,
}: EditableUsernameProps) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const finishedRef = useRef(false);

  useEffect(() => {
    const input = inputRef.current;

    if (!input) {
      return;
    }

    input.focus({ preventScroll: true });
    input.setSelectionRange(input.value.length, input.value.length);
  }, []);

  const finish = (commit: boolean) => {
    if (finishedRef.current) {
      return;
    }

    finishedRef.current = true;

    if (commit) {
      onCommit(value);
    } else {
      onCancel();
    }
  };

  return (
    <input
      aria-label="修改用户名"
      className={styles.nameInput}
      maxLength={32}
      onBlur={() => finish(true)}
      onChange={(event) => setValue(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          finish(true);
        } else if (event.key === "Escape") {
          event.preventDefault();
          finish(false);
        }
      }}
      ref={inputRef}
      spellCheck={false}
      type="text"
      value={value}
    />
  );
}

interface UserTableProps {
  users: AdminUser[];
  totalCount: number;
  editingId: number | null;
  page: number;
  totalPages: number;
  onStartEdit: (id: number) => void;
  onCancelEdit: () => void;
  onCommitEdit: (id: number, name: string) => void;
  onDeleteClick: (user: AdminUser, trigger: HTMLButtonElement) => void;
  onPageChange: (page: number) => void;
}

export default function UserTable({
  users,
  totalCount,
  editingId,
  page,
  totalPages,
  onStartEdit,
  onCancelEdit,
  onCommitEdit,
  onDeleteClick,
  onPageChange,
}: UserTableProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className={styles.tableArea}>
      <table className={styles.table} aria-label="用户列表">
        <colgroup>
          <col className={styles.colCheck} />
          <col className={styles.colIndex} />
          <col className={styles.colInfo} />
          <col className={styles.colRole} />
          <col className={styles.colEmail} />
          <col className={styles.colDate} />
          <col className={styles.colAction} />
        </colgroup>

        <thead>
          <tr className={styles.headRow}>
            <th className={styles.checkHead} scope="col">
              <span
                className={styles.decorCheckbox}
                aria-hidden="true"
                role="presentation"
              />
            </th>
            <th aria-label="序号" className={styles.headCell} scope="col" />
            <th className={styles.headCell} scope="col">
              用户信息
            </th>
            <th className={styles.headCell} scope="col">
              角色
            </th>
            <th className={styles.headCell} scope="col">
              邮箱
            </th>
            <th className={styles.headCell} scope="col">
              注册时间
            </th>
            <th className={cn(styles.headCell, styles.actionHead)} scope="col">
              操作
            </th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td className={styles.emptyCell} colSpan={7}>
                <div className={styles.emptyState}>
                  <p className={styles.emptyTitle}>未找到匹配的用户</p>
                  <p className={styles.emptyHint}>
                    请尝试其他用户名或邮箱关键词
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr className={styles.row} key={user.id}>
                <td className={styles.checkCell}>
                  <span
                    className={styles.decorCheckbox}
                    aria-hidden="true"
                    role="presentation"
                  />
                </td>
                <td className={styles.indexCell}>{user.id}</td>
                <td className={styles.infoCell}>
                  <span className={styles.avatar} aria-hidden="true">
                    {user.id}
                  </span>
                  {editingId === user.id ? (
                    <EditableUsername
                      initialValue={user.name}
                      onCancel={onCancelEdit}
                      onCommit={(value) => onCommitEdit(user.id, value)}
                    />
                  ) : (
                    <span className={styles.userName}>{user.name}</span>
                  )}
                </td>
                <td className={styles.cell}>{user.role}</td>
                <td className={styles.cell}>{user.email}</td>
                <td className={styles.cell}>{user.createdAt}</td>
                <td className={styles.actionCell}>
                  <div className={styles.actions}>
                    <button
                      className={styles.rowButton}
                      onClick={() => onStartEdit(user.id)}
                      type="button"
                    >
                      编辑
                    </button>
                    <button
                      className={styles.rowButton}
                      onClick={(event) =>
                        onDeleteClick(user, event.currentTarget)
                      }
                      type="button"
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalCount > 0 ? (
        <nav className={styles.pagination} aria-label="用户列表分页">
          <button
            aria-label="上一页"
            className={styles.pageButton}
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            type="button"
          >
            <Chevron direction="left" />
          </button>

          {pages.map((pageNumber) => (
            <button
              aria-current={pageNumber === page ? "page" : undefined}
              aria-label={`第 ${pageNumber} 页`}
              className={cn(
                styles.pageButton,
                pageNumber === page && styles.pageButtonActive,
              )}
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              type="button"
            >
              {pageNumber}
            </button>
          ))}

          <button
            aria-label="下一页"
            className={styles.pageButton}
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            type="button"
          >
            <Chevron direction="right" />
          </button>
        </nav>
      ) : null}
    </div>
  );
}
