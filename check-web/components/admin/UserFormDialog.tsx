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

/**
 * 新增用户弹窗。
 *
 * 负责三件事：
 * 1. 收集用户名、角色、邮箱、密码；
 * 2. 本地校验必填项和邮箱格式，把错误显示在字段下方，并聚焦第一个错误字段；
 * 3. 校验通过后把数据交给 UserManagement，由父组件更新列表、关闭弹窗并提示。
 *
 * 密码只用于表单校验，不会写入用户列表数据。
 * 角色下拉支持鼠标和键盘：上下键切换、Enter/Space 选择、Esc 收起。
 */
export default function UserFormDialog({
  onCancel,
  onSubmit,
}: UserFormDialogProps) {
  // 表单值；role 默认“用户”，密码只在前端校验，不进入列表数据。
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
  // 提交标记：校验通过并调用 onSubmit 后置为 true，防止重复新增。
  const submittedRef = useRef(false);

  // 弹窗基础行为；Esc 时优先收起角色下拉，再关闭整个弹窗。
  useDialogFocus(dialogRef, null, () => {
    if (roleOpen) {
      setRoleOpen(false);
      setActiveRole(-1);
      roleButtonRef.current?.focus();
      return;
    }

    onCancel();
  });

  // 点击角色下拉框以外的区域时收起下拉。
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

  // 修改某个文本字段时，同时清掉该字段的错误提示。
  const updateTextField = (field: TextField, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  // 选中角色后收起下拉，并把焦点还给角色按钮，方便继续用键盘操作。
  const chooseRole = (role: UserRole) => {
    setForm((previous) => ({ ...previous, role }));
    setRoleOpen(false);
    setActiveRole(-1);
    roleButtonRef.current?.focus();
  };

  // 角色下拉的键盘操作：上下切换、Enter/Space 选中、Esc 收起。
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

  // 提交前先做本地校验：必填项 + 邮箱格式。
  // 校验失败时聚焦第一个出错的字段，不调用父组件的 onSubmit。
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

    // 标记已提交；之后再点“确认”或按 Enter 都会被开头的判断拦住，避免重复新增。
    submittedRef.current = true;
    onSubmit({ name, role: form.role, email, password: form.password });
  };

  return (
    <div
      className={styles.overlay}
      /* 只有点击遮罩本身才关闭；点击弹窗内容不会误触发取消。 */
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
          {/* 用户名：必填，失焦/提交时由 handleSubmit 统一校验 */}
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

          {/* 角色：自定义下拉，展开后的浮层覆盖在邮箱字段上方，不改变弹窗高度 */}
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

              {/* 下拉选项：鼠标选择和键盘选择共用 chooseRole */}
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
                      /* 阻止 mousedown 抢焦点，选择后焦点仍停在角色按钮上。 */
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

          {/* 邮箱：必填，并用 EMAIL_PATTERN 做格式校验 */}
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

          {/* 密码：只做必填校验，提交给父组件后不进入列表数据 */}
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
