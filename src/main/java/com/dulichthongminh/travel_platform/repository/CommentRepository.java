package com.dulichthongminh.travel_platform.repository;

import com.dulichthongminh.travel_platform.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    // Tìm danh sách bình luận của một bài viết theo ID và sắp xếp cũ trước mới sau
    List<Comment> findByPostIdOrderByCreatedAtAsc(Long postId);
}