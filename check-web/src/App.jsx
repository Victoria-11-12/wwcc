import { Routes, Route, Link } from 'react-router'
import { Home } from './pages/Home.jsx'
import { Login } from './pages/Login.jsx'
import { Register } from './pages/Register.jsx'
import { Admin } from './pages/Admin.jsx'

export const App = () => {
  return (
    <>
      {/* 导航区：Link 生成跳转链接，切换路由但不刷新页面 */}
      <nav>
        <Link to="/">首页</Link> | <Link to="/login">登录</Link> |{' '}
        <Link to="/register">注册</Link> | <Link to="/admin">管理</Link>
      </nav>
      {/* 路由表：path 匹配 URL，命中后渲染 element 对应的组件 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  )
}
