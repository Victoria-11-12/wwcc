import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import { App } from './App.jsx'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'


<ConfigProvider locale={zhCN}>
  <App />
</ConfigProvider>

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 路由容器：监听 URL，把路径匹配到对应页面组件 */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
