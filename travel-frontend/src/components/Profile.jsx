import React, { useState } from 'react';

const Profile = () => {
    // Khởi tạo state user từ localStorage
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(user?.fullName || "");

    const handleUpdateName = () => {
        if (!newName.trim()) return;
        
        // Tạo object mới với tên đã thay đổi
        const updatedUser = { ...user, fullName: newName };
        
        // Cập nhật State (Sử dụng setUser ở đây để hết lỗi ESLint)
        setUser(updatedUser);
        
        // Lưu lại vào localStorage để các trang khác (Dashboard, Community) cũng cập nhật theo
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        setIsEditing(false);
        alert("Cập nhật tên thành công!");
    };

    if (!user) return <div className="container mt-5 alert alert-warning">Vui lòng đăng nhập!</div>;

    return (
        <div className="container mt-5">
            <div className="card shadow-lg border-0 mx-auto p-5 text-center" style={{maxWidth: '600px'}}>
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4 shadow" 
                     style={{width: '100px', height: '100px', fontSize: '40px'}}>
                    {user.fullName.charAt(0).toUpperCase()}
                </div>

                {isEditing ? (
                    <div className="mb-3">
                        <input 
                            type="text" 
                            className="form-control mb-2 text-center" 
                            value={newName} 
                            onChange={(e) => setNewName(e.target.value)}
                        />
                        <button className="btn btn-success btn-sm me-2" onClick={handleUpdateName}>Lưu</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(false)}>Hủy</button>
                    </div>
                ) : (
                    <>
                        <h2 className="fw-bold">{user.fullName}</h2>
                        <button className="btn btn-sm btn-link text-decoration-none" onClick={() => setIsEditing(true)}>
                            ✏️ Đổi tên hiển thị
                        </button>
                    </>
                )}

                <p className="text-muted mt-2">ID Người dùng: #{user.id}</p>
                <hr />
                
                <div className="text-start bg-light p-3 rounded">
                    <p className="mb-2"><strong>Tên đăng nhập:</strong> {user.username}</p>
                    <p className="mb-0"><strong>Sở thích mặc định:</strong> {user.preferences}</p>
                </div>

                <div className="mt-4 small text-muted">
                    * Lưu ý: Sở thích có thể thay đổi nhanh tại Dashboard hoặc Community Card.
                </div>
            </div>
        </div>
    );
};

export default Profile;