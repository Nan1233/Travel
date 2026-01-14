import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Community from './components/Community';
import Profile from './components/Profile';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Thêm <ToastContainer /> vào cuối Router
function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <Router>
      {/* Navbar: Xóa class collapse để các link luôn hiển thị */}
      <nav className="navbar navbar-expand navbar-dark bg-dark mb-4 shadow sticky-top">
        <div className="container">
          <Link className="navbar-brand fw-bold text-info" to="/">TRAVEL AI</Link>
          
          {/* Menu chính: Luôn hiện các link này */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link px-3" to="/community">Cộng đồng</Link>
            </li>
            {user && (
              <li className="nav-item">
                <Link className="nav-link px-3" to="/dashboard">Gợi ý AI</Link>
              </li>
            )}
          </ul>

          {/* Phần User/Nút bấm bên phải */}
          <div className="d-flex align-items-center">
            {user ? (
              <div className="d-flex align-items-center">
                <Link className="text-light me-3 text-decoration-none small d-none d-md-block" to="/profile">
                  Chào, <strong>{user.fullName}</strong>
                </Link>
                <button className="btn btn-outline-danger btn-sm rounded-pill px-3" onClick={handleLogout}>Đăng xuất</button>
              </div>
            ) : (
              <div className="btn-group">
                <Link className="btn btn-outline-light btn-sm" to="/login">Đăng nhập</Link>
                <Link className="btn btn-info btn-sm text-white" to="/register">Đăng ký</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/" element={
            <div className="text-center mt-5 py-5 bg-light rounded shadow-sm border">
              <h1 className="fw-bold display-5">Hệ Thống Du Lịch Thông Minh</h1>
              <p className="lead text-muted">Kết nối cộng đồng và tối ưu hóa lịch trình bằng AI.</p>
              {!user ? (
                <div className="mt-4">
                  <Link to="/register" className="btn btn-primary btn-lg px-5 shadow rounded-pill">Bắt đầu ngay</Link>
                </div>
              ) : (
                <div className="mt-4">
                   <Link to="/dashboard" className="btn btn-success btn-lg px-5 shadow rounded-pill">Khám phá Dashboard</Link>
                </div>
              )}
            </div>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;