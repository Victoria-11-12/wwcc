"use client";

import { useEffect, useRef, useState } from "react";

// 表单需要保存和更新界面状态，所以放在客户端组件中运行。
import BookSearch from "@/components/check/BookSearch";
import BookSelector, {
  type BookCategory,
} from "@/components/check/BookSelector";
import ManuscriptInput, {
  type ManuscriptMode,
} from "@/components/check/ManuscriptInput";
import SubmitNotice from "@/components/check/SubmitNotice";

import styles from "./CheckForm.module.css";

// 提交提示只包含是否显示和提示文字。
interface SubmitNoticeState {
  visible: boolean;
  message: string;
}

// 所有表单控件共用同一份状态，后续交互都从这里更新。
interface CheckFormState {
  selectedBook: string | null; // 已选书籍；null 表示还没有选书。
  openCategory: BookCategory | null; // 当前展开的分类；null 表示没有展开。
  searchQuery: string; // 搜索框中的关键词。
  manuscriptMode: ManuscriptMode; // 当前是上传文档还是粘贴文本。
  submitNotice: SubmitNoticeState; // 提交后要显示的提示信息。
}

// 初始页面不选书、不展开分类，也不显示提交提示。
const INITIAL_STATE: CheckFormState = {
  selectedBook: null, // 初始没有选择对标书籍。
  openCategory: null, // 初始没有展开任何分类下拉。
  searchQuery: "", // 初始搜索框为空。
  manuscriptMode: "upload", // 默认使用“上传文档”方式。
  submitNotice: {
    visible: false, // 初始不显示提示。
    message: "请先登录", // 未登录提交时使用的提示文字。
  },
};

interface CheckFormProps {
  isLoggedIn: boolean; // 当前用户是否已经登录。
}

// 提示显示 2.5 秒后自动消失，避免一直挡住页面内容。
const NOTICE_DURATION_MS = 2500;

export default function CheckForm({ isLoggedIn }: CheckFormProps) {
  // 子组件只负责显示，选书、搜索和提示数据都由这里统一提供。
  const [formState, setFormState] =
    useState<CheckFormState>(INITIAL_STATE);

  // 记录当前的提示定时器；再次提交时先取消旧定时器，防止提示提前消失。
  const noticeTimerRef = useRef<number | null>(null);

  // 组件卸载时清理定时器，避免离开页面后继续修改已经不存在的组件。
  useEffect(() => {
    return () => {
      if (noticeTimerRef.current !== null) {
        window.clearTimeout(noticeTimerRef.current);
      }
    };
  }, []);

  function handleSubmit() {
    // 第 3 节要求已登录提交暂不产生任何后续效果，因此直接结束处理。
    if (isLoggedIn) {
      return;
    }

    // 使用函数式更新读取最新状态，只改提示，不覆盖用户已经填写的内容。
    setFormState((current) => ({
      ...current,
      submitNotice: {
        visible: true,
        message: "请先登录",
      },
    }));

    // 连续点击时取消上一次计时，再从点击时刻重新计算提示时长。
    if (noticeTimerRef.current !== null) {
      window.clearTimeout(noticeTimerRef.current);
    }

    // 计时结束时只隐藏提示，其他表单状态保持不变。
    noticeTimerRef.current = window.setTimeout(() => {
      setFormState((current) => ({
        ...current,
        submitNotice: {
          ...current.submitNotice,
          visible: false,
        },
      }));
      noticeTimerRef.current = null; // 清理引用，表示当前没有正在运行的提示计时器。
    }, NOTICE_DURATION_MS);
  }

  function handleCategoryClick(category: BookCategory) {
    // 点击另一个分类会替换当前展开项；再次点击同一分类则关闭下拉。
    setFormState((current) => ({
      ...current,
      openCategory:
        current.openCategory === category ? null : category,
    }));
  }

  function handleBookSelect(book: string) {
    // 每次只保存一本书，选书后立即关闭分类下拉。
    setFormState((current) => ({
      ...current,
      selectedBook: book,
      openCategory: null,
    }));
  }

  function handleSearchQueryChange(searchQuery: string) {
    // 输入搜索词时关闭分类下拉，避免两个浮层同时出现。
    setFormState((current) => ({
      ...current,
      searchQuery,
      openCategory: null,
    }));
  }

  function handleSearchBookSelect(book: string) {
    // 从搜索结果选书后清空关键词，并替换之前选择的书籍。
    setFormState((current) => ({
      ...current,
      selectedBook: book,
      searchQuery: "",
      openCategory: null,
    }));
  }

  function handleSearchFocus() {
    // 开始使用搜索框时关闭分类下拉。
    setFormState((current) => ({
      ...current,
      openCategory: null,
    }));
  }

  function handleManuscriptModeChange(mode: ManuscriptMode) {
    // 两种输入方式互斥，切换时直接替换当前模式。
    setFormState((current) => ({
      ...current,
      manuscriptMode: mode,
    }));
  }

  return (
    <section className={styles.card} aria-label="查重表单">
      {/* 初始状态下提示组件不会显示。 */}
      <SubmitNotice notice={formState.submitNotice} />

      {/* 上半区包含书籍分类和搜索框。 */}
      <div className={styles.booksSection}>
        {/* 分类下拉和已选书名共用同一本书的选择状态。 */}
        <BookSelector
          activeCategory={formState.openCategory}
          selectedBook={formState.selectedBook}
          onCategoryClick={handleCategoryClick}
          onBookSelect={handleBookSelect}
        />
        {/* 搜索词由表单统一保存，选书结果也回写到同一个表单状态。 */}
        <BookSearch
          query={formState.searchQuery}
          onQueryChange={handleSearchQueryChange}
          onBookSelect={handleSearchBookSelect}
          onSearchFocus={handleSearchFocus}
        />
      </div>

      {/* 下半区用于上传文档或粘贴文本。 */}
      <div className={styles.manuscriptSection}>
        {/* 当前模式由表单保存，点击切换后再传回组件决定显示内容。 */}
        <ManuscriptInput
          mode={formState.manuscriptMode}
          onModeChange={handleManuscriptModeChange}
        />
      </div>

      {/* 按钮统一调用 handleSubmit，由登录状态决定显示提示还是暂时不做处理。 */}
      {/* TODO：待查重提交流程确定后，在登录用户点击时接入提交和报告流程。 */}
      <button
        className={styles.submitButton}
        type="button"
        onClick={handleSubmit}
      >
        提交
      </button>
    </section>
  );
}
