# 后台用户管理模块说明

对应路由：`/admin`，页面入口：`app/admin/page.tsx`。

这份说明面向后续维护者，帮助快速看懂 `components/admin/` 下的代码。更细的行为说明以注释为准。

## 1. 文件职责

| 文件 | 作用 |
| --- | --- |
| `app/admin/page.tsx` | 路由入口，只负责组合左侧栏和右侧用户管理 |
| `AdminSidebar` | 左侧管理员信息与“用户管理”导航，静态展示 |
| `UserManagement` | 页面主容器，保存所有业务状态，协调搜索、弹窗、提示和分页 |
| `UserSearch` | 搜索输入框与建议浮层，受控组件 |
| `UserTable` | 表格、行内用户名编辑、空状态和分页按钮 |
| `UserFormDialog` | 新增用户表单、角色下拉、校验 |
| `DeleteUserDialog` | 删除确认弹窗 |
| `OperationToast` | 顶部成功/失败提示条 |
| `user-data.ts` | 用户类型、示例数据、分页大小和搜索工具函数 |
| `useDialogFocus.ts` | 弹窗公共行为：焦点进入、Tab 循环、Esc、关闭后聚焦回触发按钮 |

## 2. 组件结构

```text
AdminPage
├─ AdminSidebar
└─ UserManagement
   ├─ UserSearch
   ├─ UserTable
   ├─ UserFormDialog
   ├─ DeleteUserDialog
   └─ OperationToast
```

## 3. 数据流

`UserManagement` 里的 `users` 是唯一数据源：

```text
users
  → 按 appliedQuery 过滤
  → filteredUsers
  → 按 PAGE_SIZE 切页
  → pageUsers
  → UserTable
```

几个关键点：

- `user.id` 同时作为表格序号和头像数字，删除用户后不会重新编号。
- `query` 是输入框实时值，只用来显示搜索建议。
- `appliedQuery` 是点击建议、点击放大镜或按 Enter 后才生效的筛选词。
- 分页页数由数据总量动态计算，没有写死“只有两页”。
- 新增用户的 id 取当前最大值 + 1，避免复用已删除的序号。

## 4. 交互流程

### 搜索

- 输入时只更新 `query` 并显示建议，不立刻改变表格。
- 点击建议项：输入框填入该用户名，并按该用户名筛选。
- 点击放大镜：按当前输入值筛选（用户名或邮箱包含关键词）。
- Enter：有高亮建议时选建议，否则按当前输入筛选。
- 清空输入：立即恢复完整列表并回到第一页。

### 新增用户

1. 点击“新增用户”，`UserManagement` 挂载 `UserFormDialog`。
2. 表单校验用户名、邮箱、密码必填，邮箱还需符合格式。
3. 校验失败：错误显示在字段下方，并聚焦第一个错误字段。
4. 校验通过：密码只用于校验，不写入用户列表；`UserManagement` 追加用户、关闭弹窗、显示“新增成功”。

### 修改用户名

- 点击某行“编辑”，只有该行用户名变成输入框。
- Enter 或失焦保存；Esc 取消。
- 空名称不会覆盖原值，并显示失败提示。
- 保存后表格和搜索建议都会使用新用户名。

### 删除用户

- 点击“删除”打开确认弹窗，弹窗会显示待删除用户名。
- 取消：列表不变，焦点回到删除按钮。
- 确认：按 `user.id` 精确删除，保留其他行序号；如果当前页被删空，自动退回上一页。
- 删除成功后显示“删除成功”提示。

### 分页

- 每页 `PAGE_SIZE`（当前为 6）条。
- 第一页禁用“上一页”，最后一页禁用“下一页”。
- 搜索、新增或删除后，页码不会超过新的总页数。

## 5. 当前数据与接后端的位置

当前没有后端接口，页面使用 `user-data.ts` 的 `INITIAL_USERS` 作为示例数据。

接入真实接口时，通常只需要改 `UserManagement`：

- 把 `useState(INITIAL_USERS)` 换成接口返回的数据；
- 在 `handleAddUser`、`handleCommitEdit`、`handleConfirmDelete` 中调用新增/修改/删除接口；
- 接口成功后仍然更新本地 `users`，现有表格、搜索和分页逻辑不需要改。

## 6. 无障碍与键盘

- 搜索输入框使用 `role="combobox"`，建议列表使用 `role="listbox"`。
- 弹窗使用 `role="dialog"` / `role="alertdialog"`，并通过 `aria-labelledby`、`aria-describedby` 关联标题与说明。
- 弹窗打开后焦点进入弹窗，Tab 焦点只在弹窗内循环，Esc 关闭。
- 成功提示使用 `role="status"`，失败提示使用 `role="alert"`。
- 左侧装饰方框只是视觉元素，没有 `tabIndex`，也不能点击。
