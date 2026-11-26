import { Plus } from "lucide-react";

import styles from "./ManuscriptInput.module.css";

// 限制输入方式只能是两种值，避免出现设计稿以外的状态。
export type ManuscriptMode = "upload" | "paste";

interface ManuscriptInputProps {
  mode: ManuscriptMode; // 决定当前显示上传文档还是粘贴文本。
  onModeChange: (mode: ManuscriptMode) => void; // 点击切换按钮时更新输入方式。
}

export default function ManuscriptInput({
  mode,
  onModeChange,
}: ManuscriptInputProps) {
  return (
    <div>
      <div className={styles.controlRow}>
        <h2 className={styles.heading}>上传网文</h2>

        {/* 两种输入方式互斥，同一时间只能选中一个。 */}
        <div
          className={styles.modeGroup}
          role="radiogroup"
          aria-label="网文输入方式"
        >
          {/* aria-checked 和 data-active 使用同一个判断，保证无障碍状态与视觉状态一致。 */}
          <button
            className={styles.modeButton}
            type="button"
            role="radio"
            aria-checked={mode === "upload"}
            data-active={mode === "upload"}
            onClick={() => onModeChange("upload")}
          >
            <span className={styles.radioMark} aria-hidden="true" />
            上传文档
          </button>
          <button
            className={styles.modeButton}
            type="button"
            role="radio"
            aria-checked={mode === "paste"}
            data-active={mode === "paste"}
            onClick={() => onModeChange("paste")}
          >
            <span className={styles.radioMark} aria-hidden="true" />
            粘贴文本
          </button>
        </div>
      </div>

      {/* 初始界面显示上传占位；切换为粘贴时显示文本框。 */}
      {mode === "upload" ? (
        // TODO：接入实际上传能力，当前只展示设计稿要求的上传占位界面。
        <button className={styles.uploadArea} type="button">
          {/* 加号只用于提示用户可以上传，不单独响应点击。 */}
          <span className={styles.uploadBox}>
            <Plus className={styles.plusIcon} aria-hidden="true" />
          </span>
          <span className={styles.uploadLabel}>上传文档</span>
        </button>
      ) : (
        /* 粘贴模式使用多行文本框，输入光标默认从左上角开始。 */
        <textarea
          className={styles.textarea}
          aria-label="粘贴网文内容"
          placeholder="请粘贴需要查重的文本"
        />
      )}
    </div>
  );
}
