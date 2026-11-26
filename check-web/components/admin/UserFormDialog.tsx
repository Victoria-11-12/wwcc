"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ROLES, type UserRole } from "@/components/admin/user-data";
import { useDialogFocus } from "@/components/admin/useDialogFocus";
import styles from "./UserFormDialog.module.css";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type TextField = "name" | "email" | "password";

type FieldErrors = Partial<Record<TextField, string>>;

export interface NewUserInput {
  name: string;
  role: UserRole;
  email: string;
  password: string;
}

interface UserFormDialogProps {
  onCancel: () => void;
  onSubmit: (input: NewUserInput) => void;
}

export default function UserFormDialog({
  onCancel,
  onSubmit,
}: UserFormDialogProps) {
  const [form, setForm] = useState<NewUserInput>({
    name: "",
    role: "用户",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [roleOpen, setRoleOpen] = useState(false);
  const [activeRole, setActiveRole] = useState(-1);

  const dialogRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const roleButtonRef = useRef<HTMLButtonElement>(null);
  const roleWrapRef = useRef<HTMLDivElement>(null);
  const submittedRef = useRef(false);

  useDialogFocus(dialogRef, null, () => {
    if (roleOpen) {
      setRoleOpen(false);
      setActiveRole(-1);
      roleButtonRef.current?.focus();
      return;
    }

    onCancel();
  });

  useEffect(() => {
    if (!roleOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (
        roleWrapRef.current &&
        !roleWrapRef.current.contains(event.target as Node)
      ) {
        setRoleOpen(false);
        setActiveRole(-1);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [roleOpen]);

  const updateTextField = (field: TextField, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  const chooseRole = (role: UserRole) => {
    setForm((previous) => ({ ...previous, role }));
    setRoleOpen(false);
    setActiveRole(-1);
    roleButtonRef.current?.focus();
  };

  const handleRoleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;

      if (!roleOpen) {
        setRoleOpen(true);
        setActiveRole(ROLES.indexOf(form.role));
        return;
      }

      const base =
        activeRole < 0 ? ROLES.indexOf(form.role) : activeRole;
      setActiveRole(
        (base + direction + ROLES.length) % ROLES.length,
      );
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      if (roleOpen) {
        chooseRole(ROLES[activeRole] ?? form.role);
        return;
      }

      setRoleOpen(true);
      setActiveRole(ROLES.indexOf(form.role));
      return;
    }

    if (event.key === "Escape" && roleOpen) {
      event.preventDefault();
      setRoleOpen(false);
      setActiveRole(-1);
      return;
    }

    if (event.key === "Tab") {
      setRoleOpen(false);
      setActiveRole(-1);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submittedRef.current) {
      return;
    }

    const name = form.name.trim();
    const email = form.email.trim();
    const nextErrors: FieldErrors = {};

    if (!name) {
      nextErrors.name = "请输入用户名";
    }

    if (!email) {
      nextErrors.email = "请输入邮箱";
    } else if (!EMAIL_PATTERN.test(email)) {
      nextErrors.email = "请输入有效的邮箱地址";
    }

    if (!form.password) {
      nextErrors.password = "请输入密码";
    }

    setErrors(nextErrors);

    if (nextErrors.name) {
      nameInputRef.current?.focus();
      return;
    }

    if (nextErrors.email) {
      emailInputRef.current?.focus();
      return;
    }

    if (nextErrors.password) {
      passwordInputRef.current?.focus();
      return;
    }

    submittedRef.current = true;
    onSubmit({ name, role: form.role, email, password: form.password });
  };

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
        aria-describedby="add-user-description"
        aria-labelledby="add-user-title"
        aria-modal="true"
        className={styles.dialog}
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <h2 className={styles.title} id="add-user-title">
          新增用户
        </h2>
        <p className={styles.description} id="add-user-description">
          请填写新用户信息
        </p>

        <form className={styles.form} noValidate onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="new-user-name">
              用户名
            </label>
            <input
              aria-describedby={errors.name ? "new-user-name-error" : undefined}
              aria-invalid={Boolean(errors.name)}
              autoComplete="off"
              className={cn(styles.input, errors.name && styles.inputError)}
              id="new-user-name"
              maxLength={32}
              onChange={(event) => updateTextField("name", event.target.value)}
              placeholder="请输入用户名"
              ref={nameInputRef}
              spellCheck={false}
              type="text"
              value={form.name}
            />
            {errors.name ? (
              <p className={styles.error} id="new-user-name-error" role="alert">
                {errors.name}
              </p>
            ) : null}
          </div>

          <div className={styles.field}>
            <span className={styles.label} id="new-user-role-label">
              角色
            </span>
            <div className={styles.selectWrap} ref={roleWrapRef}>
              <button
                aria-activedescendant={
                  roleOpen && activeRole >= 0
                    ? `new-user-role-option-${activeRole}`
                    : undefined
                }
                aria-controls={
                  roleOpen ? "new-user-role-options" : undefined
                }
                aria-expanded={roleOpen}
                aria-haspopup="listbox"
                aria-labelledby="new-user-role-label"
                className={styles.selectButton}
                onClick={() => {
                  setRoleOpen((open) => {
                    if (open) {
                      setActiveRole(-1);
                    }
                    return !open;
                  });
                }}
                onKeyDown={handleRoleKeyDown}
                ref={roleButtonRef}
                type="button"
              >
                <span>{form.role}</span>
                <span className={styles.caret} aria-hidden="true" />
              </button>

              {roleOpen ? (
                <ul
                  aria-label="角色选项"
                  className={styles.roleOptions}
                  id="new-user-role-options"
                  role="listbox"
                >
                  {ROLES.map((role, index) => (
                    <li
                      aria-selected={form.role === role}
                      className={cn(
                        styles.roleOption,
                        index === activeRole && styles.roleOptionActive,
                      )}
                      id={`new-user-role-option-${index}`}
                      key={role}
                      onClick={() => chooseRole(role)}
                      onMouseDown={(event) => event.preventDefault()}
                      onMouseEnter={() => setActiveRole(index)}
                      role="option"
                    >
                      {role}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="new-user-email">
              邮箱
            </label>
            <input
              aria-describedby={
                errors.email ? "new-user-email-error" : undefined
              }
              aria-invalid={Boolean(errors.email)}
              autoComplete="off"
              className={cn(styles.input, errors.email && styles.inputError)}
              id="new-user-email"
              maxLength={100}
              onChange={(event) => updateTextField("email", event.target.value)}
              placeholder="请输入邮箱"
              ref={emailInputRef}
              spellCheck={false}
              type="email"
              value={form.email}
            />
            {errors.email ? (
              <p className={styles.error} id="new-user-email-error" role="alert">
                {errors.email}
              </p>
            ) : null}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="new-user-password">
              密码
            </label>
            <input
              aria-describedby={
                errors.password ? "new-user-password-error" : undefined
              }
              aria-invalid={Boolean(errors.password)}
              autoComplete="new-password"
              className={cn(
                styles.input,
                errors.password && styles.inputError,
              )}
              id="new-user-password"
              maxLength={64}
              onChange={(event) =>
                updateTextField("password", event.target.value)
              }
              placeholder="••••••••"
              ref={passwordInputRef}
              type="password"
              value={form.password}
            />
            {errors.password ? (
              <p
                className={styles.error}
                id="new-user-password-error"
                role="alert"
              >
                {errors.password}
              </p>
            ) : null}
          </div>

          <div className={styles.footer}>
            <button
              className={styles.cancelButton}
              onClick={onCancel}
              type="button"
            >
              取消
            </button>
            <button className={styles.confirmButton} type="submit">
              确认
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
