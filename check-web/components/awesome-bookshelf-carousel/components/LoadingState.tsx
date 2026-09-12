/**
 * 书架轮播的加载状态组件。
 *
 * 当书籍数据正在从接口获取时显示转圈动画和 `LOADING` 文案，
 * 直到数据加载结束或请求失败后由主组件切换到其他界面。
 */
export function LoadingState() {
  return (
    <div
      style={{
        // 铺满整个视口，并将内部内容垂直、水平居中。
        width: "100vw",
        height: "100vh",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      {/* 旋转圆弧：只显示部分边框，再通过 spin 动画持续旋转。 */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "1.5px solid rgba(200,135,58,0.2)",
          borderTop: "1.5px solid rgba(200,135,58,0.7)",
          animation: "spin 0.9s linear infinite",
        }}
      />

      {/* 加载提示文字，使用项目定义的等宽字体和字距。 */}
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "rgba(200,135,58,0.4)",
          letterSpacing: "0.22em",
        }}
      >
        LOADING
      </p>
    </div>
  );
}