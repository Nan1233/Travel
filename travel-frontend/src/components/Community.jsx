import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ProfileCard from './ProfileCard';
import { toast } from 'react-toastify';

const Community = () => {
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState("");
    const [file, setFile] = useState(null);
    const [commentTexts, setCommentTexts] = useState({});
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

    const fetchPosts = useCallback(async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/community/posts");
            const postsWithComments = await Promise.all(res.data.map(async (post) => {
                const cRes = await axios.get(`http://localhost:8080/api/community/post/${post.id}/comments`);
                return { ...post, comments: cRes.data };
            }));
            setPosts(postsWithComments);
        } catch (err) { 
            console.error("Lỗi fetch:", err); 
            toast.error("🚀 Không thể tải bài viết!");
        }
    }, []);

    useEffect(() => { if (user) fetchPosts(); }, [fetchPosts, user]);

    const handlePost = async (e) => {
        e.preventDefault();
        if (!content.trim() || !user?.id) {
            toast.warn("✍️ Vui lòng nhập nội dung!");
            return;
        }

        setLoading(true);
        try {
            let imageUrl = "";
            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                const uploadRes = await axios.post("http://localhost:8080/api/files/upload", formData);
                imageUrl = uploadRes.data;
            }

            const postPayload = {
                user: { id: parseInt(user.id) },
                content: content,
                imageUrl: imageUrl || ""
            };

            await axios.post("http://localhost:8080/api/community/post", postPayload);
            
            toast.success("🚀 Đăng bài thành công!");
            setContent(""); 
            setFile(null); 
            fetchPosts();
        } catch (postErr) {
            console.error("Lỗi chi tiết:", postErr);
            toast.error("❌ Đăng bài thất bại. Thử lại sau!");
        } finally { 
            setLoading(false); 
        }
    };

    const handleDeletePost = async (postId) => {
        if (window.confirm("Bạn có chắc muốn xóa bài viết này?")) {
            try {
                await axios.delete(`http://localhost:8080/api/community/post/${postId}?userId=${user.id}`);
                toast.info("🗑️ Đã xóa bài viết");
                fetchPosts();
            // eslint-disable-next-line no-unused-vars
            } catch (err) { 
                toast.error("❌ Lỗi xóa bài!"); 
            }
        }
    };

    const handleLike = async (postId) => {
        try {
            await axios.post(`http://localhost:8080/api/community/post/${postId}/like?userId=${user.id}`);
            fetchPosts();
        // eslint-disable-next-line no-unused-vars
        } catch (err) { 
            toast.error("❤️ Lỗi tương tác!");
        }
    };

    const handleComment = async (postId) => {
        const text = commentTexts[postId];
        if (!text?.trim()) return;
        try {
            await axios.post(`http://localhost:8080/api/community/post/${postId}/comment`, {
                content: text, userId: user.id, userFullName: user.fullName
            });
            setCommentTexts({ ...commentTexts, [postId]: "" }); 
            toast.success("💬 Đã gửi bình luận!");
            fetchPosts();
        // eslint-disable-next-line no-unused-vars
        } catch (err) { 
            toast.error("❌ Lỗi gửi bình luận!");
        }
    };

    if (!user) return <div className="container mt-5 alert alert-warning">Vui lòng đăng nhập!</div>;

    return (
        <div className="container mt-3 pb-5">
            <div className="row">
                <div className="col-md-4">
                    <ProfileCard user={user} onPreferenceChange={(p) => setUser({...user, preferences: p})} />
                </div>
                <div className="col-md-8">
                    <div className="card shadow-sm mb-4 p-3 border-0 bg-white">
                        <form onSubmit={handlePost}>
                            <textarea className="form-control mb-2 border-0 bg-light" rows="3" 
                                style={{resize: 'none'}}
                                placeholder="Chia sẻ trải nghiệm của bạn..." value={content}
                                onChange={(e) => setContent(e.target.value)} />
                            <div className="d-flex justify-content-between align-items-center">
                                <input type="file" className="form-control form-control-sm w-50" accept="image/*"
                                    onChange={e => setFile(e.target.files[0])} />
                                <button className="btn btn-primary rounded-pill px-4 fw-bold" disabled={loading}>
                                    {loading ? "Đang gửi..." : "Đăng bài"}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="posts-list">
                        {posts.length === 0 && <p className="text-center text-muted mt-5">Chưa có bài viết nào...</p>}
                        {posts.map(post => (
                            <div className="card shadow-sm border-0 mb-4 overflow-hidden bg-white" key={post.id}>
                                <div className="p-3">
                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2 shadow-sm" style={{width: '38px', height: '38px', fontWeight: 'bold'}}>
                                                {post.user?.fullName?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h6 className="mb-0 fw-bold">{post.user?.fullName}</h6>
                                                <small className="text-muted" style={{fontSize: '11px'}}>{new Date(post.createdAt).toLocaleDateString()}</small>
                                            </div>
                                        </div>
                                        {post.user?.id === user.id && (
                                            <button className="btn btn-sm text-danger border-0 opacity-75" onClick={() => handleDeletePost(post.id)}>🗑️</button>
                                        )}
                                    </div>
                                    <p className="small mb-3 text-secondary" style={{whiteSpace: 'pre-line'}}>{post.content}</p>
                                    {post.imageUrl && (
                                        <img src={`http://localhost:8080/api/files/images/${post.imageUrl}`} 
                                             className="img-fluid rounded mb-3 w-100 shadow-sm" 
                                             style={{maxHeight: '400px', objectFit: 'cover'}} alt="post" />
                                    )}
                                    <div className="d-flex gap-4 border-top pt-2">
                                        <button className={`btn btn-sm border-0 fw-bold ${post.likedUserIds?.includes(user.id) ? 'text-danger' : 'text-muted'}`} onClick={() => handleLike(post.id)}>
                                            ❤️ {post.likedUserIds?.length || 0}
                                        </button>
                                        <span className="text-muted small py-1 fw-bold">💬 {post.comments?.length || 0}</span>
                                    </div>
                                </div>
                                <div className="bg-light p-3 border-top">
                                    {post.comments?.map(c => (
                                        <div key={c.id} className="mb-2 pb-1 border-bottom border-white small">
                                            <b className="text-primary">{c.userFullName}</b>: {c.content}
                                        </div>
                                    ))}
                                    <div className="d-flex mt-2">
                                        <input className="form-control form-control-sm me-2 border-0 shadow-sm" placeholder="Bình luận..." 
                                            value={commentTexts[post.id] || ""} onChange={e => setCommentTexts({...commentTexts, [post.id]: e.target.value})}
                                            onKeyDown={(e) => e.key === 'Enter' && handleComment(post.id)} />
                                        <button className="btn btn-sm btn-primary px-3 shadow-sm" onClick={() => handleComment(post.id)}>Gửi</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Community;