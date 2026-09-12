import { useMemo, type CSSProperties } from "react";

/** 一颗漂浮尘埃在页面中的位置和动画参数。 */
type DustParticle = {
  /** React 列表使用的唯一标识。 */
  id: number;

  /** 尘埃距离容器左侧的位置。 */
  left: string;

  /** 尘埃尺寸，单位是像素。 */
  size: number;

  /** 单次漂浮动画的持续时间，单位是秒。 */
  dur: number;

  /** 动画延迟时间，用来避免所有尘埃同时移动。 */
  del: number;

  /** 粒子在动画中横向移动的距离。 */
  dx: string;
};

/**
 * 书架轮播的背景装饰组件。
 *
 * 组件由两层组成：
 * - 底层渐变、噪点、灯光和暗角；
 * - 上层持续漂浮的尘埃粒子。
 *
 * 所有元素都不接收鼠标事件，不会影响书架上的点击和悬停交互。
 */
export function Backdrop() {
  // 尘埃参数只计算一次，组件重新渲染时保持位置和动画不变。
  const dustParticles = useMemo<DustParticle[]>(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        id: index,
        left: `${10 + (index / 18) * 80}%`,
        size: 1 + (index % 3) * 0.6,
        dur: 16 + ((index * 1.8) % 12),
        del: -((index * 0.9) % 16),
        dx: `${(Math.sin(index * 2.1) * 30).toFixed(0)}px`,
      })),
    [],
  );

  return (
    <>
      {/* 底层背景：渐变、噪点、暖色灯光和四周暗角。 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        {/* 深色木质背景和多层径向光晕。 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `
          radial-gradient(ellipse 70% 50% at 15% 80%, rgba(180,100,20,0.10) 0%, transparent 55%),
          radial-gradient(ellipse 50% 40% at 85% 20%, rgba(160,90,15,0.07) 0%, transparent 55%),
          radial-gradient(ellipse 80% 60% at 50% 100%, rgba(100,50,10,0.18) 0%, transparent 50%),
          linear-gradient(to bottom, #0e0b05 0%, #1a1208 40%, #120d06 100%)
        `,
          }}
        />

        {/* 使用 SVG 分形噪点增加背景颗粒感。 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.025,
            backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='1'/></svg>")`,
            backgroundSize: "200px 200px",
          }}
        />

        {/* 左上角的暖色灯光，持续执行轻微闪烁动画。 */}
        <div
          style={{
            position: "absolute",
            top: "-60px",
            left: "8%",
            width: 320,
            height: 320,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(220,140,40,0.12) 0%, transparent 70%)",
            animation: "lampFlicker 8s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />

        {/* 四周暗角让视线更集中到中间的书本区域。 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 25%, rgba(0,0,0,0.65) 100%)",
          }}
        />
      </div>

      {/* 上层漂浮尘埃，每颗粒子使用不同尺寸、位置和动画时间。 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {dustParticles.map((particle) => (
          <div
            key={particle.id}
            style={
              {
                position: "absolute",
                bottom: "30%",
                left: particle.left,
                width: particle.size,
                height: particle.size,
                borderRadius: "50%",
                background: "rgba(220,180,80,0.7)",
                // CSS 变量 --dx 由 dustFloat 动画读取，用于控制横向漂移。
                "--dx": particle.dx,
                animation: `dustFloat ${particle.dur}s ${particle.del}s ease-in-out infinite`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </>
  );
}