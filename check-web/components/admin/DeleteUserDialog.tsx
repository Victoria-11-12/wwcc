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

export default function DeleteUserDialog({
  user,
  onCancel,
  onConfirm,
}: DeleteUserDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useDialogFocus(dialogRef, null, onCancel);

  return (
    <div
      className={styles.overlay}
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
