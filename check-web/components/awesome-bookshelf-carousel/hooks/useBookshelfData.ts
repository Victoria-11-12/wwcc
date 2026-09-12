import { useCallback, useEffect, useRef, useState } from "react";
import type { BookCard } from "../types";

/**
 * `useBookshelfData` 接收的参数。
 *
 * `data` 和 `apiEndpoint` 二选一：
 * - 传入 `data` 时直接使用本地数据；
 * - 未传入 `data` 且存在 `apiEndpoint` 时，通过网络接口获取数据。
 */
type UseBookshelfDataOptions = {
  /** 组件外部直接传入的书籍数据，优先级高于网络请求。 */
  data?: BookCard[];

  /** 获取书籍数据的接口地址。 */
  apiEndpoint?: string;

  /** 请求接口时附加的请求头。 */
  apiHeaders?: Record<string, string>;

  /** 把接口返回的原始数据转换成 `BookCard[]`。 */
  apiTransform?: (raw: unknown) => BookCard[];
};

/**
 * 管理书架数据来源。
 *
 * Hook 会根据 `data` 或 `apiEndpoint` 返回书籍列表、加载状态、错误信息，
 * 并提供 `refetch` 供组件手动重新请求数据。
 */
export function useBookshelfData({
  data,
  apiEndpoint,
  apiHeaders,
  apiTransform,
}: UseBookshelfDataOptions) {
  // 初始数据优先使用外部传入的 data，否则先显示空数组。
  const [books, setBooks] = useState<BookCard[]>(data ?? []);

  // 只有没有静态数据、但配置了接口时，首次渲染才处于加载状态。
  const [loading, setLoading] = useState(!data && !!apiEndpoint);

  // 保存请求失败信息；null 表示当前没有错误。
  const [error, setError] = useState<string | null>(null);

  /** 保存最新请求编号，用来忽略过期请求返回的数据。 */
  const requestId = useRef(0);

  /** 请求接口并更新书籍列表；组件也可以通过返回值手动调用它。 */
  const refetch = useCallback(async () => {
    // 没有接口地址时无需请求。
    if (!apiEndpoint) return;

    // 每次请求都生成新编号，旧请求返回时就能判断自己是否已经过期。
    const currentRequestId = ++requestId.current;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(apiEndpoint, {
        headers: { "Content-Type": "application/json", ...apiHeaders },
      });

      // HTTP 状态码不是 2xx 时，当作请求失败处理。
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const raw: unknown = await response.json();

      // 如果期间又发起了新请求，就丢弃当前这次旧请求的结果。
      if (currentRequestId !== requestId.current) return;

      // 优先使用调用方提供的转换函数，其次兼容数组和 { data: [...] } 两种格式。
      const nextBooks: BookCard[] = apiTransform
        ? apiTransform(raw)
        : Array.isArray(raw)
          ? (raw as BookCard[])
          : (raw as { data: BookCard[] }).data;
      setBooks(nextBooks);
    } catch (requestError) {
      // 旧请求发生错误时也不能覆盖最新请求的状态。
      if (currentRequestId !== requestId.current) return;
      setError(
        requestError instanceof Error ? requestError.message : "Failed to load",
      );
    } finally {
      // 只有最新请求可以结束加载状态，避免旧请求提前关闭 loading。
      if (currentRequestId === requestId.current) setLoading(false);
    }
    // 接口地址变化时才重新创建 refetch，避免 effect 无条件重复执行。
  }, [apiEndpoint]);

  useEffect(() => {
    // 有静态数据时直接同步到状态，不发起网络请求。
    if (data) {
      setBooks(data);
      return;
    }

    // 没有静态数据时，根据接口地址获取数据。
    refetch();
  }, [data, refetch]);

  // 返回组件渲染和手动刷新所需要的全部数据与状态。
  return { books, loading, error, refetch };
}