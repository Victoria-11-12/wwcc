import { Routes, Route, Link } from 'react-router'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Admin from './pages/Admin.jsx'

function App() {
  return (
    <>
      <nav>
        <Link to="/">首页</Link> | <Link to="/login">登录</Link> |{' '}
        <Link to="/register">注册</Link> | <Link to="/admin">管理</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  )
}

export default App
