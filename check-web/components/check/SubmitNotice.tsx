import styles from "./SubmitNotice.module.css";

// 提示组件只负责按状态显示文字，不参与提交处理。
interface SubmitNoticeProps {
  notice: {
    visible: boolean;
    message: string;
  };
}

export default function SubmitNotice({ notice }: SubmitNoticeProps) {
  // 没有提示时不渲染组件，避免占用页面空间。
  if (!notice.visible) {
    return null;
  }

  return (
    /* role="alert" 会让屏幕阅读器及时播报登录提示。 */
    <div className={styles.notice} role="alert">
      {notice.message}
    </div>
  );
}
