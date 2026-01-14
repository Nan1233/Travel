package com.dulichthongminh.travel_platform.repository;

import com.dulichthongminh.travel_platform.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    @Query("SELECT p FROM Post p ORDER BY p.createdAt DESC")
    List<Post> findAllOrderByCreatedAtDesc();

    @Query("SELECT p FROM Post p WHERE p.content LIKE %:keyword% ORDER BY size(p.likedUserIds) DESC")
    List<Post> searchTrendingPosts(@Param("keyword") String keyword);

    List<Post> findAllByOrderByCreatedAtDesc();
}