"use client";

import Typewriter from "typewriter-effect";

type TypewriterTextProps = {
  /** 循环显示的多段文字。 */
  strings: string[];

  /** 是否循环播放。 */
  loop?: boolean;

  /** 光标字符。 */
  cursor?: string;

  /** 删除字符的速度，单位毫秒。 */
  deleteSpeed?: number;

  /** 打字速度，natural 表示自然速度。 */
  delay?: number | "natural";

  /** 外层容器类名。 */
  className?: string;
};

/** 统一封装 typewriter-effect 的基础配置。 */
export default function TypewriterText({
  strings,
  loop = true,
  cursor = "▌",
  deleteSpeed = 30,
  delay = "natural",
  className,
}: TypewriterTextProps) {
  return (
    <div className={className}>
      <Typewriter
        options={{
          strings,
          autoStart: true,
          loop,
          cursor,
          deleteSpeed,
          delay,
        }}
      />
    </div>
  );
}
