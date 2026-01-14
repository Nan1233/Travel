import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [creds, setCreds] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8080/api/auth/login", creds);
            // Lưu thông tin user vào localStorage
            localStorage.setItem("user", JSON.stringify(res.data));
            
            // Chuyển hướng sang trang Dashboard sau khi đăng nhập thành công
            navigate("/dashboard");
        } catch (err) {
            // Sử dụng err để console giúp kiểm thử, xóa cảnh báo ESLint
            console.error("Lỗi đăng nhập hệ thống:", err);
            alert("Sai tài khoản hoặc máy chủ chưa khởi động!");
        }
    };

    return (
        <div className="card mx-auto shadow-sm p-4" style={{maxWidth: '400px'}}>
            <h3 className="text-center mb-4">Đăng nhập</h3>
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <input 
                        className="form-control" 
                        placeholder="Tên đăng nhập" 
                        required
                        onChange={e => setCreds({...creds, username: e.target.value})} 
                    />
                </div>
                <div className="mb-3">
                    <input 
                        className="form-control" 
                        type="password" 
                        placeholder="Mật khẩu" 
                        required
                        onChange={e => setCreds({...creds, password: e.target.value})} 
                    />
                </div>
                <button className="btn btn-success w-100">Vào hệ thống</button>
            </form>
        </div>
    );
};

export default Login;