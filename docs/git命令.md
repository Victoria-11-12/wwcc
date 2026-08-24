# Git 常用命令

## Commit 规范

| 前缀       | 说明                 | 版本影响  |
| -------- | ------------------ | ----- |
| feat     | 新增功能               | MINOR |
| fix      | 修复 bug             | PATCH |
| docs     | 修改文档               | -     |
| style    | 代码格式调整（不影响运行）      | -     |
| refactor | 重构代码（不修 bug 也不加功能） | -     |
| perf     | 性能优化               | -     |
| test     | 添加或修改测试            | -     |
| chore    | 构建流程、工具链等变更        | -     |

## 分支命名规范

| 前缀        | 说明       | 示例                        |
| --------- | -------- | ------------------------- |
| feature/  | 新功能开发    | feature/user-login        |
| fix/      | 修复 Bug   | fix/db-connection         |
| hotfix/   | 紧急修复生产环境 | hotfix/security-patch     |
| docs/     | 仅修改文档    | docs/update-install-guide |
| refactor/ | 代码重构     | refactor/api-structure    |

## 初始配置（一次性）

```bash
# 配置用户信息
git config --global user.name "Victoria"
git config --global user.email "2162096926@qq.com"

# 设置代理
git config --global https.proxy http://127.0.0.1:7890

# 初始化仓库并关联远程
git init
git remote add origin <仓库链接>
git branch -m master main
git push -u origin main
```

## 日常开发

```bash
# 拉取最新代码
git pull origin main

# 查看状态
git status

# 添加到暂存区
git add .                    # 全部
git add <文件名>              # 指定文件

# 提交
git commit -m "feat: 增加电影搜索功能"

# 推送
git push origin main

# 取消暂存的文件
git rm --cached <文件名>
```

## 查看历史

```bash
git log --oneline            # 精简提交历史
git branch                   # 查看本地分支（* 标记当前）
git remote -v                # 查看远程仓库地址
```

## 撤销与回退

```bash
# 修改提交信息
git commit --amend -m '新的信息'

# 若有代码改动
git add .
git commit --amend -m '追加到上一次'

# 丢弃未提交的修改
git checkout -- <文件名>

# 撤销最近一次提交，保留代码改动
git reset --soft HEAD~1

# 强制回退到指定版本（代码会彻底改变）
git reset --hard <commit-id>
```

## 分支管理

```bash
# 创建并切换到新分支
git checkout -b feature-ai

# 切换分支
git checkout main

# 合并分支到当前分支
git merge feature-ai

# 删除已合并的分支
git branch -d feature-ai
```
