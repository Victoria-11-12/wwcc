"use client";

import { useRef } from "react";
import { useDialogFocus } from "@/components/admin/useDialogFocus";
import type { AdminUser } from "@/components/admin/user-data";
import styles from "./DeleteUserDialog.module.css";

interface DeleteUserDialogProps {
  user: AdminUser;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * 删除用户确认弹窗。
 *
 * 使用 alertdialog 语义，让屏幕阅读器知道这是一个需要立即确认的操作。
 * 弹窗只负责展示待删除用户名并触发回调；真正的删除、分页调整和提示
 * 都由 UserManagement 处理。
 */
export default function DeleteUserDialog({
  user,
  onCancel,
  onConfirm,
}: DeleteUserDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // 打开后聚焦弹窗容器（不默认聚焦“确认删除”，避免误按 Enter 直接删除）。
  useDialogFocus(dialogRef, null, onCancel);

  return (
    <div
      className={styles.overlay}
      /* 只有点击遮罩本身才取消；点击弹窗内容不会误关。 */
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        aria-describedby="delete-user-message delete-user-description"
        aria-labelledby="delete-user-title"
        aria-modal="true"
        className={styles.dialog}
        ref={dialogRef}
        role="alertdialog"
        tabIndex={-1}
      >
        <h2 className={styles.title} id="delete-user-title">
          删除用户
        </h2>
        {/* 明确写出待删除用户名，避免误删相邻行 */}
        <p className={styles.body} id="delete-user-message">
          是否确认删除「{user.name}」？
        </p>
        <p className={styles.hint} id="delete-user-description">
          删除后，该用户将从当前列表移除。
        </p>

        <div className={styles.footer}>
          <button
            className={styles.cancelButton}
            onClick={onCancel}
            type="button"
          >
            取消
          </button>
          <button
            className={styles.confirmButton}
            onClick={onConfirm}
            type="button"
          >
            确认删除
          </button>
        </div>
      </div>
    </div>
  );
}
