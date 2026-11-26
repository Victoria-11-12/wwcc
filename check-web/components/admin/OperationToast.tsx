"use client";

import { cn } from "@/lib/utils";
import styles from "./OperationToast.module.css";

interface OperationToastProps {
  message: string;
  tone: "success" | "error";
}

function SuccessIcon() {
  return (
    <svg
      className={styles.icon}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m4.5 12.5 5 5 10-11" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      className={styles.icon}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5" />
      <path d="M12 16.5h.01" />
    </svg>
  );
}

export default function OperationToast({
  message,
  tone,
}: OperationToastProps) {
  const isError = tone === "error";

  return (
    <div
      aria-atomic="true"
      aria-live={isError ? "assertive" : "polite"}
      className={cn(styles.toast, isError && styles.error)}
      role={isError ? "alert" : "status"}
    >
      {isError ? <ErrorIcon /> : <SuccessIcon />}
      <span>{message}</span>
    </div>
  );
}
