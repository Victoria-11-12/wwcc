import CheckForm from "@/components/check/CheckForm";
import CheckHeader, {
  type CheckUser,
} from "@/components/check/CheckHeader";

import styles from "./page.module.css";

// 页头与表单共用这一份用户状态，保证两处登录判断始终一致。
// 当前未接入真实登录数据；有用户信息后，页头和表单会同时切换为已登录状态。
const currentUser: CheckUser | null = null;

export default function CheckPage() {
  return (
    <main className={styles.page}>
      {/* 页面标题供读屏使用，视觉上保持设计稿的空白顶部。 */}
      <h1 className={styles.visuallyHidden}>查重提交</h1>
      {/* 把同一个用户状态传给页头，由页头决定显示已登录还是未登录样式。 */}
      <CheckHeader user={currentUser} />
      {/* 页头下方铺背景图，并在中间放置表单卡片。 */}
      <div className={styles.workspace}>
        {/* 表单只接收“是否登录”的结论，提交流程仍由表单内部统一处理。 */}
        <CheckForm isLoggedIn={currentUser !== null} />
      </div>
    </main>
  );
}
