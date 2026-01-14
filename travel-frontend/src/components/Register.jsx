import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [form, setForm] = useState({ username: '', password: '', fullName: '', preferences: 'Bien' });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8080/api/auth/register", form);
            alert("Đăng ký thành công! Mời bạn đăng nhập.");
            navigate("/login");
        } catch (err) {
            alert("Lỗi: " + (err.response?.data || "Không thể kết nối server"));
        }
    };

    return (
        <div className="card mx-auto shadow-sm p-4" style={{maxWidth: '450px'}}>
            <h3 className="text-center mb-4">Đăng ký thành viên</h3>
            <form onSubmit={handleRegister}>
                <div className="mb-3">
                    <input className="form-control" placeholder="Tên đăng nhập" required
                        onChange={e => setForm({...form, username: e.target.value})} />
                </div>
                <div className="mb-3">
                    <input className="form-control" type="password" placeholder="Mật khẩu" required
                        onChange={e => setForm({...form, password: e.target.value})} />
                </div>
                <div className="mb-3">
                    <input className="form-control" placeholder="Họ và tên" required
                        onChange={e => setForm({...form, fullName: e.target.value})} />
                </div>
                <div className="mb-3">
                    <label className="form-label small">Sở thích du lịch:</label>
                    <select className="form-select" onChange={e => setForm({...form, preferences: e.target.value})}>
                        <option value="Bien">Du lịch Biển</option>
                        <option value="Nui">Du lịch Núi / Khám phá</option>
                        <option value="Van hoa">Văn hóa / Lịch sử</option>
                    </select>
                </div>
                <button className="btn btn-primary w-100">Đăng ký ngay</button>
            </form>
        </div>
    );
};

export default Register;