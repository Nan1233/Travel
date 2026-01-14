import React, { useState } from 'react';
import axios from 'axios';
import Markdown from 'react-markdown';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const [destination, setDestination] = useState("");
    const [recommendation, setRecommendation] = useState("");
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!destination.trim()) return toast.warn("📍 Hãy nhập điểm đến!");

        setLoading(true);
        try {
            const res = await axios.get("http://localhost:8080/api/ai/recommend", {
                params: { destination, preference: user?.preferences || "Khám phá" }
            });
            setRecommendation(res.data);
            toast.success("✨ Lịch trình đã sẵn sàng!");
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            toast.error("❌ Robot đang bận, thử lại sau!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4 pb-5">
            <div className="row g-4">
                {/* CỘT TRÁI: FORM ĐIỀU KHIỂN */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm p-4 sticky-top" style={{ top: '90px', borderRadius: '15px' }}>
                        <h5 className="fw-bold text-primary mb-3">
                            <i className="bi bi-stars me-2"></i>Trợ Lý Lịch Trình AI
                        </h5>
                        <p className="small text-muted mb-4">Kết hợp AI và trải nghiệm thực tế từ cộng đồng.</p>
                        
                        <form onSubmit={handleGenerate}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-uppercase">Điểm đến</label>
                                <input 
                                    type="text" className="form-control bg-light border-0 py-2 shadow-sm"
                                    placeholder="Vd: Nha Trang, Hà Nội..."
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                />
                            </div>
                            <div className="p-3 mb-4 rounded-3 bg-primary bg-opacity-10 border border-primary border-opacity-25">
                                <small className="d-block text-muted">Sở thích cá nhân:</small>
                                <span className="badge bg-primary rounded-pill mt-1">{user?.preferences || "Mặc định"}</span>
                            </div>
                            <button className="btn btn-primary w-100 py-2 fw-bold shadow-sm rounded-pill" disabled={loading}>
                                {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : "TẠO LỊCH TRÌNH 🚀"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* CỘT PHẢI: KẾT QUẢ */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm p-4 bg-white" style={{ minHeight: '600px', borderRadius: '15px' }}>
                        <div className="border-bottom pb-3 mb-4 d-flex justify-content-between align-items-center">
                            <h4 className="fw-bold mb-0">🗺️ Kế hoạch chuyến đi</h4>
                            {recommendation && <button className="btn btn-sm btn-outline-info" onClick={() => window.print()}>In</button>}
                        </div>

                        {loading ? (
                            <div className="text-center py-5 mt-5">
                                <div className="spinner-grow text-primary" role="status"></div>
                                <p className="mt-3 text-muted">Đang phân tích dữ liệu cộng đồng và tạo lịch trình...</p>
                            </div>
                        ) : recommendation ? (
                            <div className="ai-render text-dark" style={{ lineHeight: '1.8' }}>
                                <Markdown>{recommendation}</Markdown>
                            </div>
                        ) : (
                            <div className="text-center py-5 opacity-50">
                                <i className="bi bi-map-fill display-1"></i>
                                <h5 className="mt-3">Bắt đầu hành trình của bạn</h5>
                                <p>Nhập địa danh bạn muốn đến để AI tư vấn.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;