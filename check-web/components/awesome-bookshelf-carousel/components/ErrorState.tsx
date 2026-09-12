/** `ErrorState` 组件需要的属性。 */
type ErrorStateProps = {
  /** 需要展示给用户的错误提示或空状态文案。 */
  msg: string;

  /** 用户点击重试按钮时执行的函数。 */
  onRetry: () => void;
};

/**
 * 书架加载失败或无书可显示时的状态组件。
 *
 * 组件同时覆盖“接口请求失败”和“没有书籍数据”两种情况：
 * 上方显示警告文案，下方提供重试按钮。
 */
export function ErrorState({ msg, onRetry }: ErrorStateProps) {
  return (
    <div
      style={{
        // 铺满视口，并让错误内容保持在屏幕中央。
        width: "100vw",
        height: "100vh",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
      }}
    >
      {/* 错误或空状态提示文案。 */}
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "rgba(220,80,80,0.6)",
          letterSpacing: "0.1em",
        }}
      >
        ⚠ {msg}
      </p>

      {/* 点击后重新调用数据请求或恢复默认数据。 */}
      <button
        onClick={onRetry}
        style={{
          background: "transparent",
          border: "1px solid rgba(242,232,208,0.15)",
          color: "rgba(242,232,208,0.4)",
          padding: "7px 20px",
          cursor: "pointer",
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.18em",
        }}
      >
        RETRY
      </button>
    </div>
  );
}