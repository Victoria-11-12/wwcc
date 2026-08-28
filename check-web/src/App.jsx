import { Routes, Route, Link, Navigate } from 'react-router'
import { Login } from './pages/Login.jsx'
import { Register } from './pages/Register.jsx'
import { Check } from './pages/Check.jsx'
import { History } from './pages/History.jsx'
import { Profile } from './pages/Profile.jsx'
import { SourceData } from './pages/SourceData.jsx'
import { Admin } from './pages/Admin.jsx'

export const App = () => {
  return (
    <>
      {/* 导航区：Link 生成跳转链接，切换路由但不刷新页面 */}
      <nav>
        <Link to="/check">查重</Link> | <Link to="/history">历史记录</Link> |{' '}
        <Link to="/profile">个人中心</Link> | <Link to="/data">网文数据</Link> |{' '}
        <Link to="/admin">管理</Link> | <Link to="/login">登录</Link> |{' '}
        <Link to="/register">注册</Link>
      </nav>
      {/* 路由表：path 匹配 URL，命中后渲染 element 对应的组件 */}
      <Routes>
        <Route path="/" element={<Navigate to="/check" replace />} />
        <Route path="/check" element={<Check />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/data" element={<SourceData />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  )
}
