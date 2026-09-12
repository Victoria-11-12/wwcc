// @ts-nocheck
import ce, {
  useState as R,
  useRef as W,
  useCallback as U,
  useEffect as O,
  useMemo as se,
} from "react";
import { getBookGeometry, isDarkColor } from "./utils";
import { useBookshelfData } from "./hooks/useBookshelfData";
import { useCarousel } from "./hooks/useCarousel";
import { LoadingState } from "./components/LoadingState";
import { ErrorState } from "./components/ErrorState";
import { Backdrop } from "./components/Backdrop";
import { CarouselControls } from "./components/CarouselControls";
import { BookDetailPanel } from "./components/BookDetailPanel";
var X = { exports: {} },
  D = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var te;
function ue() {
  if (te) return D;
  te = 1;
  var t = Symbol.for("react.transitional.element"),
    n = Symbol.for("react.fragment");
  function i(d, o, a) {
    var c = null;
    if (
      (a !== void 0 && (c = "" + a),
      o.key !== void 0 && (c = "" + o.key),
      "key" in o)
    ) {
      a = {};
      for (var s in o) s !== "key" && (a[s] = o[s]);
    } else a = o;
    return (
      (o = a.ref),
      {
        $$typeof: t,
        type: d,
        key: c,
        ref: o !== void 0 ? o : null,
        props: a,
      }
    );
  }
  return ((D.Fragment = n), (D.jsx = i), (D.jsxs = i), D);
}
var H = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var re;
function pe() {
  return (
    re ||
      ((re = 1),
      process.env.NODE_ENV !== "production" &&
        (function () {
          function t(e) {
            if (e == null) return null;
            if (typeof e == "function")
              return e.$$typeof === _ ? null : e.displayName || e.name || null;
            if (typeof e == "string") return e;
            switch (e) {
              case w:
                return "Fragment";
              case K:
                return "Profiler";
              case Z:
                return "StrictMode";
              case T:
                return "Suspense";
              case L:
                return "SuspenseList";
              case k:
                return "Activity";
            }
            if (typeof e == "object")
              switch (
                (typeof e.tag == "number" &&
                  console.error(
                    "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue.",
                  ),
                e.$$typeof)
              ) {
                case E:
                  return "Portal";
                case z:
                  return e.displayName || "Context";
                case B:
                  return (e._context.displayName || "Context") + ".Consumer";
                case q:
                  var l = e.render;
                  return (
                    (e = e.displayName),
                    e ||
                      ((e = l.displayName || l.name || ""),
                      (e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")),
                    e
                  );
                case N:
                  return (
                    (l = e.displayName || null),
                    l !== null ? l : t(e.type) || "Memo"
                  );
                case F:
                  ((l = e._payload), (e = e._init));
                  try {
                    return t(e(l));
                  } catch {}
              }
            return null;
          }
          function n(e) {
            return "" + e;
          }
          function i(e) {
            try {
              n(e);
              var l = !1;
            } catch {
              l = !0;
            }
            if (l) {
              l = console;
              var h = l.error,
                b =
                  (typeof Symbol == "function" &&
                    Symbol.toStringTag &&
                    e[Symbol.toStringTag]) ||
                  e.constructor.name ||
                  "Object";
              return (
                h.call(
                  l,
                  "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
                  b,
                ),
                n(e)
              );
            }
          }
          function d(e) {
            if (e === w) return "<>";
            if (typeof e == "object" && e !== null && e.$$typeof === F)
              return "<...>";
            try {
              var l = t(e);
              return l ? "<" + l + ">" : "<...>";
            } catch {
              return "<...>";
            }
          }
          function o() {
            var e = $.A;
            return e === null ? null : e.getOwner();
          }
          function a() {
            return Error("react-stack-top-frame");
          }
          function c(e) {
            if (M.call(e, "key")) {
              var l = Object.getOwnPropertyDescriptor(e, "key").get;
              if (l && l.isReactWarning) return !1;
            }
            return e.key !== void 0;
          }
          function s(e, l) {
            function h() {
              v ||
                ((v = !0),
                console.error(
                  "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
                  l,
                ));
            }
            ((h.isReactWarning = !0),
              Object.defineProperty(e, "key", {
                get: h,
                configurable: !0,
              }));
          }
          function p() {
            var e = t(this.type);
            return (
              j[e] ||
                ((j[e] = !0),
                console.error(
                  "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release.",
                )),
              (e = this.props.ref),
              e !== void 0 ? e : null
            );
          }
          function x(e, l, h, b, V, Q) {
            var m = h.ref;
            return (
              (e = {
                $$typeof: y,
                type: e,
                key: l,
                props: h,
                _owner: b,
              }),
              (m !== void 0 ? m : null) !== null
                ? Object.defineProperty(e, "ref", {
                    enumerable: !1,
                    get: p,
                  })
                : Object.defineProperty(e, "ref", {
                    enumerable: !1,
                    value: null,
                  }),
              (e._store = {}),
              Object.defineProperty(e._store, "validated", {
                configurable: !1,
                enumerable: !1,
                writable: !0,
                value: 0,
              }),
              Object.defineProperty(e, "_debugInfo", {
                configurable: !1,
                enumerable: !1,
                writable: !0,
                value: null,
              }),
              Object.defineProperty(e, "_debugStack", {
                configurable: !1,
                enumerable: !1,
                writable: !0,
                value: V,
              }),
              Object.defineProperty(e, "_debugTask", {
                configurable: !1,
                enumerable: !1,
                writable: !0,
                value: Q,
              }),
              Object.freeze && (Object.freeze(e.props), Object.freeze(e)),
              e
            );
          }
          function u(e, l, h, b, V, Q) {
            var m = l.children;
            if (m !== void 0)
              if (b)
                if (I(m)) {
                  for (b = 0; b < m.length; b++) g(m[b]);
                  Object.freeze && Object.freeze(m);
                } else
                  console.error(
                    "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.",
                  );
              else g(m);
            if (M.call(l, "key")) {
              m = t(e);
              var A = Object.keys(l).filter(function (de) {
                return de !== "key";
              });
              ((b =
                0 < A.length
                  ? "{key: someKey, " + A.join(": ..., ") + ": ...}"
                  : "{key: someKey}"),
                J[m + b] ||
                  ((A =
                    0 < A.length ? "{" + A.join(": ..., ") + ": ...}" : "{}"),
                  console.error(
                    `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
                    b,
                    m,
                    A,
                    m,
                  ),
                  (J[m + b] = !0)));
            }
            if (
              ((m = null),
              h !== void 0 && (i(h), (m = "" + h)),
              c(l) && (i(l.key), (m = "" + l.key)),
              "key" in l)
            ) {
              h = {};
              for (var ee in l) ee !== "key" && (h[ee] = l[ee]);
            } else h = l;
            return (
              m &&
                s(
                  h,
                  typeof e == "function"
                    ? e.displayName || e.name || "Unknown"
                    : e,
                ),
              x(e, m, h, o(), V, Q)
            );
          }
          function g(e) {
            f(e)
              ? e._store && (e._store.validated = 1)
              : typeof e == "object" &&
                e !== null &&
                e.$$typeof === F &&
                (e._payload.status === "fulfilled"
                  ? f(e._payload.value) &&
                    e._payload.value._store &&
                    (e._payload.value._store.validated = 1)
                  : e._store && (e._store.validated = 1));
          }
          function f(e) {
            return typeof e == "object" && e !== null && e.$$typeof === y;
          }
          var S = ce,
            y = Symbol.for("react.transitional.element"),
            E = Symbol.for("react.portal"),
            w = Symbol.for("react.fragment"),
            Z = Symbol.for("react.strict_mode"),
            K = Symbol.for("react.profiler"),
            B = Symbol.for("react.consumer"),
            z = Symbol.for("react.context"),
            q = Symbol.for("react.forward_ref"),
            T = Symbol.for("react.suspense"),
            L = Symbol.for("react.suspense_list"),
            N = Symbol.for("react.memo"),
            F = Symbol.for("react.lazy"),
            k = Symbol.for("react.activity"),
            _ = Symbol.for("react.client.reference"),
            $ =
              S.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
            M = Object.prototype.hasOwnProperty,
            I = Array.isArray,
            Y = console.createTask
              ? console.createTask
              : function () {
                  return null;
                };
          S = {
            react_stack_bottom_frame: function (e) {
              return e();
            },
          };
          var v,
            j = {},
            C = S.react_stack_bottom_frame.bind(S, a)(),
            G = Y(d(a)),
            J = {};
          ((H.Fragment = w),
            (H.jsx = function (e, l, h) {
              var b = 1e4 > $.recentlyCreatedOwnerStacks++;
              return u(
                e,
                l,
                h,
                !1,
                b ? Error("react-stack-top-frame") : C,
                b ? Y(d(e)) : G,
              );
            }),
            (H.jsxs = function (e, l, h) {
              var b = 1e4 > $.recentlyCreatedOwnerStacks++;
              return u(
                e,
                l,
                h,
                !0,
                b ? Error("react-stack-top-frame") : C,
                b ? Y(d(e)) : G,
              );
            }));
        })()),
    H
  );
}
var ne;
function ge() {
  return (
    ne ||
      ((ne = 1),
      process.env.NODE_ENV === "production"
        ? (X.exports = ue())
        : (X.exports = pe())),
    X.exports
  );
}
var r = ge();
function Pe({
  data: t,
  apiEndpoint: n,
  apiHeaders: i,
  apiTransform: d,
  shelfHeight: o = 260,
  spineMinWidth: a = 44,
  spineMaxWidth: c = 72,
  autoInterval: s = 4200,
  onBookClick: p,
  onBookChange: x,
}) {
  const {
      books: u,
      loading: g,
      error: f,
      refetch: S,
    } = useBookshelfData({
      data: t,
      apiEndpoint: n,
      apiHeaders: i,
      apiTransform: d,
    }),
    y = u.length,
    E = se(() => getBookGeometry(u, o, a, c), [u, o, a, c]);
  const {
    activeIdx: w,
    hoveredIdx: K,
    isHovered: z,
    shelfRef: N,
    bookRefs: F,
    selectBook: k,
    nextBook: _,
    previousBook: $,
    handleBookClick: M,
    setHoveredIdx: B,
    handleMouseEnter,
    handleMouseLeave,
  } = useCarousel({
    books: u,
    autoInterval: s,
    onBookClick: p,
    onBookChange: x,
  });
  if (g) return /* @__PURE__ */ r.jsx(LoadingState, {});
  if (f) return /* @__PURE__ */ r.jsx(ErrorState, { msg: f, onRetry: S });
  if (!y)
    return /* @__PURE__ */ r.jsx(ErrorState, {
      msg: "No books to display.",
      onRetry: S,
    });
  const I = u[w],
    Y = E[w];
  return /* @__PURE__ */ r.jsxs("div", {
    style: {
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      position: "relative",
      background: "var(--bg)",
      display: "flex",
      flexDirection: "column",
    },
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    children: [
      /* @__PURE__ */ r.jsx(Backdrop, {}),
      /* @__PURE__ */ r.jsx("div", {
        style: {
          flex: 1,
          position: "relative",
          zIndex: 10,
          overflow: "visible",
        },
        children: /* @__PURE__ */ r.jsx(
          we,
          {
            book: I,
            geo: Y,
            idx: w,
            total: y,
            onOpenClick: () => M(w, I),
          },
          w,
        ),
      }),
      /* @__PURE__ */ r.jsx(je, {
        books: u,
        geos: E,
        activeIdx: w,
        hoveredIdx: K,
        shelfHeight: o,
        shelfRef: N,
        bookRefs: F,
        onBookClick: M,
        onBookHover: B,
      }),
      /* @__PURE__ */ r.jsx(CarouselControls, {
        books: u,
        activeIdx: w,
        hovered: z,
        autoInterval: s,
        onPrev: $,
        onNext: _,
        onDot: k,
        accent: (I == null ? void 0 : I.spineColor) ?? "#c8873a",
      }),
    ],
  });
}
function we({ book: t, geo: n, idx: i, total: d, onOpenClick: o }) {
  if (!t) return null;
  const [a, c] = R(() => typeof window < "u" && window.innerWidth < 820);
  O(() => {
    const p = () => c(window.innerWidth < 820);
    return (
      window.addEventListener("resize", p),
      () => window.removeEventListener("resize", p)
    );
  }, []);
  const s = t.spineColor;
  return (
    isDarkColor(s),
    /* @__PURE__ */ r.jsxs("div", {
      style: {
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: a ? "center" : "stretch",
        flexDirection: a ? "column" : "row",
        paddingTop: a ? "clamp(28px,6vw,48px)" : "clamp(64px,6.5vw,112px)",
        paddingRight: "clamp(28px,4vw,56px)",
        paddingBottom: a ? "clamp(18px,4vw,32px)" : "clamp(28px,4vw,56px)",
        paddingLeft: "clamp(28px,4vw,56px)",
        gap: a ? "clamp(16px,4vw,24px)" : "clamp(24px,3vw,48px)",
        transform: a ? "none" : "translateY(18px)",
      },
      children: [
        /* @__PURE__ */ r.jsx("div", {
          style: {
            flexShrink: 0,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: a ? "center" : "flex-start",
            perspective: "800px",
            animation: "fadeIn 0.4s ease both",
          },
          children: /* @__PURE__ */ r.jsx(BookDetailPanel, {
            book: t,
            geo: n,
            onOpenClick: o,
          }),
        }),
        /* @__PURE__ */ r.jsxs("div", {
          style: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: a ? "center" : "flex-end",
            alignItems: a ? "center" : "stretch",
            textAlign: a ? "center" : "left",
            paddingBottom: a ? 0 : 8,
            maxWidth: a ? 640 : 520,
          },
          children: [
            /* @__PURE__ */ r.jsxs("div", {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 6,
                marginBottom: 20,
                animation: "fadeUp 0.4s 0.04s ease both",
                opacity: 0,
              },
              children: [
                /* @__PURE__ */ r.jsxs("div", {
                  style: { display: "flex", alignItems: "center", gap: 12 },
                  children: [
                    t.genre &&
                      /* @__PURE__ */ r.jsx("span", {
                        style: {
                          fontFamily: "var(--font-mono)",
                          fontSize: 9,
                          letterSpacing: "0.24em",
                          textTransform: "uppercase",
                          color: s,
                          padding: "3px 10px",
                          border: `1px solid ${s}55`,
                          background: `${s}18`,
                        },
                        children: t.genre,
                      }),
                    t.year &&
                      /* @__PURE__ */ r.jsx("span", {
                        style: {
                          fontFamily: "var(--font-mono)",
                          fontSize: 9,
                          letterSpacing: "0.14em",
                          color: "rgba(242,232,208,0.35)",
                        },
                        children: t.year,
                      }),
                  ],
                }),
                /* @__PURE__ */ r.jsxs("span", {
                  style: {
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    color: "rgba(242,232,208,0.25)",
                    letterSpacing: "0.16em",
                  },
                  children: [
                    String(i + 1).padStart(2, "0"),
                    " / ",
                    String(d).padStart(2, "0"),
                  ],
                }),
              ],
            }),
            /* @__PURE__ */ r.jsx("h1", {
              style: {
                fontFamily: "var(--font-display)",
                fontSize: "clamp(26px, 3.6vw, 50px)",
                fontWeight: 400,
                lineHeight: 1.26,
                color: "var(--paper)",
                letterSpacing: "-0.01em",
                marginTop: 12,
                paddingTop: 6,
                marginBottom: 10,
                animation: "fadeUp 0.45s 0.08s ease both",
                opacity: 0,
              },
              children: t.title,
            }),
            t.author &&
              /* @__PURE__ */ r.jsxs("div", {
                style: {
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(13px, 1.4vw, 17px)",
                  fontStyle: "italic",
                  fontWeight: 300,
                  color: s,
                  letterSpacing: "0.04em",
                  marginBottom: 18,
                  textShadow: `0 0 20px ${s}55`,
                  animation: "fadeUp 0.45s 0.12s ease both",
                  opacity: 0,
                },
                children: ["by ", t.author],
              }),
            /* @__PURE__ */ r.jsxs("div", {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 18,
                animation: "fadeUp 0.45s 0.15s ease both",
                opacity: 0,
              },
              children: [
                /* @__PURE__ */ r.jsx("div", {
                  style: { height: 1, width: 24, background: `${s}aa` },
                }),
                /* @__PURE__ */ r.jsx("div", {
                  style: {
                    width: 5,
                    height: 5,
                    background: s,
                    transform: "rotate(45deg)",
                  },
                }),
                /* @__PURE__ */ r.jsx("div", {
                  style: {
                    height: 1,
                    flex: 1,
                    background: `linear-gradient(to right, ${s}aa, transparent)`,
                  },
                }),
              ],
            }),
            t.blurb &&
              /* @__PURE__ */ r.jsx("p", {
                style: {
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(13px, 1.3vw, 16px)",
                  fontWeight: 300,
                  lineHeight: 1.8,
                  color: "rgba(242,232,208,0.62)",
                  marginBottom: 20,
                  maxWidth: 480,
                  animation: "fadeUp 0.45s 0.19s ease both",
                  opacity: 0,
                },
                children: t.blurb,
              }),
            t.quote &&
              /* @__PURE__ */ r.jsxs("blockquote", {
                style: {
                  borderLeft: `2px solid ${s}66`,
                  paddingLeft: 14,
                  marginBottom: 20,
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(12px, 1.2vw, 15px)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "rgba(242,232,208,0.44)",
                  lineHeight: 1.65,
                  animation: "fadeUp 0.45s 0.23s ease both",
                  opacity: 0,
                },
                children: ['"', t.quote, '"'],
              }),
            /* @__PURE__ */ r.jsx("div", {
              style: { animation: "fadeUp 0.45s 0.28s ease both", opacity: 0 },
              children: /* @__PURE__ */ r.jsx("button", {
                onClick: o,
                style: {
                  background: "transparent",
                  border: `1px solid ${s}60`,
                  color: s,
                  padding: "9px 24px",
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  boxShadow: `0 0 0 0 ${s}00`,
                },
                onMouseEnter: (p) => {
                  const x = p.currentTarget;
                  ((x.style.background = `${s}22`),
                    (x.style.boxShadow = `0 0 18px ${s}44`));
                },
                onMouseLeave: (p) => {
                  const x = p.currentTarget;
                  ((x.style.background = "transparent"),
                    (x.style.boxShadow = `0 0 0 0 ${s}00`));
                },
                children: "Open Book",
              }),
            }),
          ],
        }),
      ],
    })
  );
}
function je({
  books: t,
  geos: n,
  activeIdx: i,
  hoveredIdx: d,
  shelfHeight: o,
  shelfRef: a,
  bookRefs: c,
  onBookClick: s,
  onBookHover: p,
}) {
  return /* @__PURE__ */ r.jsxs("div", {
    style: {
      position: "relative",
      zIndex: 20,
      flexShrink: 0,
      width: "100%",
    },
    children: [
      /* @__PURE__ */ r.jsx("div", {
        style: {
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: o + 22 + 14,
          background: `
          linear-gradient(to bottom,
            #1e1308 0%,
            var(--wood-dark) 20%,
            #251a0c 60%,
            #1a1008 100%
          )
        `,
          zIndex: 0,
        },
      }),
      /* @__PURE__ */ r.jsxs("div", {
        ref: a,
        style: {
          position: "relative",
          zIndex: 5,
          overflowX: "auto",
          overflowY: "visible",
          scrollbarWidth: "none",
          display: "flex",
          alignItems: "flex-end",
          padding: "0 clamp(40px,8vw,120px) 0",
          paddingBottom: 60,
          gap: 3,
          height: o + 22 + 14 + 64,
          perspective: "700px",
          perspectiveOrigin: "50% 100%",
        },
        children: [
          /* @__PURE__ */ r.jsx(ae, { side: "left", height: o }),
          t.map((g, f) => {
            const S = n[f],
              y = f === i,
              E = d === f && !y;
            return /* @__PURE__ */ r.jsx(
              "div",
              {
                ref: (w) => {
                  c.current[f] = w;
                },
                onMouseEnter: () => p(f),
                onMouseLeave: () => p(null),
                onClick: () => s(f, g),
                style: {
                  flexShrink: 0,
                  width: S.width,
                  height: S.height,
                  cursor: "pointer",
                  position: "relative",
                  alignSelf: "flex-end",
                  transformStyle: "preserve-3d",
                  transform: y
                    ? "translateY(-20px) translateZ(28px) rotateY(-5deg)"
                    : E
                      ? "translateY(-9px) translateZ(10px) rotateY(-2deg)"
                      : "translateY(0) translateZ(0) rotateY(0deg)",
                  transition:
                    "transform 0.38s cubic-bezier(0.34, 1.4, 0.64, 1)",
                  zIndex: y ? 10 : E ? 6 : 1,
                },
                children: /* @__PURE__ */ r.jsx(ke, {
                  book: g,
                  geo: S,
                  isActive: y,
                  isHovered: E,
                }),
              },
              g.id,
            );
          }),
          /* @__PURE__ */ r.jsx(ae, { side: "right", height: o }),
        ],
      }),
      /* @__PURE__ */ r.jsx(Ee, { plankH: 22, depthH: 14 }),
      /* @__PURE__ */ r.jsx("div", {
        style: {
          position: "absolute",
          left: 0,
          right: 0,
          top: o + 2,
          height: 14,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%)",
          zIndex: 6,
          pointerEvents: "none",
        },
      }),
    ],
  });
}
function ke({ book: t, geo: n, isActive: i, isHovered: d }) {
  const o = t.spineColor;
  return /* @__PURE__ */ r.jsxs("div", {
    style: {
      width: "100%",
      height: "100%",
      position: "relative",
      background: n.bgCss,
      backgroundSize: "8px 8px, 100% 100%",
      // Left edge highlight (light catch)
      boxShadow: i
        ? `inset 2px 0 5px rgba(255,255,255,0.14), inset -2px 0 8px rgba(0,0,0,0.5), 4px 0 20px rgba(0,0,0,0.6), 0 0 18px ${o}50`
        : d
          ? `inset 2px 0 4px rgba(255,255,255,0.10), inset -1px 0 6px rgba(0,0,0,0.4), 3px 0 14px rgba(0,0,0,0.5), 0 0 8px ${o}28`
          : "inset 1px 0 3px rgba(255,255,255,0.07), inset -1px 0 4px rgba(0,0,0,0.35), 2px 0 8px rgba(0,0,0,0.4)",
      transition: "box-shadow 0.3s ease",
      overflow: "hidden",
    },
    children: [
      i &&
        /* @__PURE__ */ r.jsx("div", {
          style: {
            position: "absolute",
            inset: 0,
            background: `linear-gradient(90deg, transparent, ${o}22, transparent)`,
            backgroundSize: "200% 100%",
            animation: "goldShimmer 2.4s ease-in-out infinite",
          },
        }),
      /* @__PURE__ */ r.jsx("div", {
        style: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "linear-gradient(to bottom, #e8dfc8, #c4b890)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        },
      }),
      /* @__PURE__ */ r.jsxs("div", {
        style: {
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 10,
          paddingBottom: 8,
          gap: 6,
        },
        children: [
          /* @__PURE__ */ r.jsx("div", {
            style: {
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              width: "100%",
            },
            children: /* @__PURE__ */ r.jsx("div", {
              style: {
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                transform: "rotate(180deg)",
                fontFamily: "var(--font-spine)",
                fontSize: Math.max(8, Math.min(11, n.width * 0.16)),
                fontWeight: i ? 600 : 400,
                letterSpacing: "0.10em",
                lineHeight: 1.1,
                color: i ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.62)",
                textTransform: "uppercase",
                textShadow: i ? `0 0 10px ${o}88` : "none",
                transition: "all 0.3s ease",
                maxHeight: "75%",
                overflow: "hidden",
                whiteSpace: "nowrap",
              },
              children: t.title,
            }),
          }),
          i &&
            /* @__PURE__ */ r.jsx("div", {
              style: {
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: o,
                boxShadow: `0 0 6px ${o}`,
                flexShrink: 0,
              },
            }),
        ],
      }),
      /* @__PURE__ */ r.jsx("div", {
        style: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 10,
          background:
            "linear-gradient(to bottom, transparent, rgba(0,0,0,0.4))",
        },
      }),
    ],
  });
}
function Ee({ plankH: t, depthH: n }) {
  return /* @__PURE__ */ r.jsxs("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 7,
      pointerEvents: "none",
    },
    children: [
      /* @__PURE__ */ r.jsx("div", {
        style: {
          height: t,
          background: `
          repeating-linear-gradient(
            90deg,
            transparent 0px,
            transparent 60px,
            rgba(0,0,0,0.06) 60px,
            rgba(0,0,0,0.06) 62px
          ),
          linear-gradient(to bottom,
            var(--wood-edge)  0%,
            var(--wood-light) 30%,
            var(--wood-mid)   70%,
            var(--wood-dark)  100%
          )
        `,
          boxShadow:
            "inset 0 2px 4px rgba(255,255,255,0.08), inset 0 -2px 6px rgba(0,0,0,0.4)",
        },
      }),
      /* @__PURE__ */ r.jsx("div", {
        style: {
          height: n,
          background: "linear-gradient(to bottom, var(--wood-dark), #160e06)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.7)",
        },
      }),
    ],
  });
}
function ae({ side: t, height: n }) {
  return /* @__PURE__ */ r.jsx("div", {
    style: {
      flexShrink: 0,
      width: 20,
      height: n + 10,
      alignSelf: "flex-end",
      background: `linear-gradient(${t === "left" ? "90deg" : "270deg"}, var(--wood-edge), var(--wood-dark))`,
      boxShadow:
        t === "left"
          ? "2px 0 8px rgba(0,0,0,0.4)"
          : "-2px 0 8px rgba(0,0,0,0.4)",
      position: "relative",
      zIndex: 2,
    },
    children: [0.25, 0.5, 0.75].map((i) =>
      /* @__PURE__ */ r.jsx(
        "div",
        {
          style: {
            position: "absolute",
            [t === "left" ? "right" : "left"]: 5,
            top: `${i * 100}%`,
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)",
          },
        },
        i,
      ),
    ),
  });
}
type AwesomeBookshelfCarouselProps = {
  data?: any[];
  apiEndpoint?: string;
  apiHeaders?: Record<string, string>;
  apiTransform?: (raw: unknown) => any[];
  shelfHeight?: number;
  spineMinWidth?: number;
  spineMaxWidth?: number;
  autoInterval?: number;
  onBookClick?: (card: any) => void;
  onBookChange?: (index: number, card: any) => void;
};

const AwesomeBookshelfCarousel = Pe as unknown as (
  props: AwesomeBookshelfCarouselProps
) => any;

export { AwesomeBookshelfCarousel };

export type { BookCard, BookTexture } from "./types";
