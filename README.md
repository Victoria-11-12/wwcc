# 小光、小浩、小霍、小成的项目

## 现内容都在docs文件夹内
- 规范.md有每日操作流程
- 命令规范在git命令.md
- 整体计划在plan.md



## 启动命令

### 日常启动（已配置过环境）
- 前端（Next.js）：
  ```
  cd check-web
  npm run dev
  ```

- 后端（FastAPI）：
  ```
  cd backend
  venv\Scripts\activate
  uvicorn app.main:app --reload
  ```


### 首次配置启动（克隆仓库后只做一次）
前置：安装 Node.js（20.9+，建议 24）和 Python 3.11

- 前端：
  ```
  cd check-web
  npm install
  npm run dev
  ```

- 后端：
  ```
  cd backend
  python -m venv venv
  venv\Scripts\activate
  pip install -r requirements.txt
  uvicorn app.main:app --reload
  ```