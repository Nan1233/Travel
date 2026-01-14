package com.dulichthongminh.travel_platform.controller;

import com.dulichthongminh.travel_platform.entity.Comment;
import com.dulichthongminh.travel_platform.entity.Post;
import com.dulichthongminh.travel_platform.repository.CommentRepository;
import com.dulichthongminh.travel_platform.repository.PostRepository;
import com.dulichthongminh.travel_platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/community")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CommunityController {

    @Autowired
    private PostRepository postRepository;
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/posts")
    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping("/post")
    public ResponseEntity<?> createPost(@RequestBody Post post) {
        // In log ra Console để debug
        System.out.println(">>> Đang nhận yêu cầu đăng bài từ user ID: " + post.getUser().getId());
        System.out.println(">>> Nội dung: " + post.getContent());

        try {
            if (post.getUser() == null || !userRepository.existsById(post.getUser().getId())) {
                return ResponseEntity.badRequest().body("Lỗi: User không hợp lệ!");
            }
            Post savedPost = postRepository.save(post);
            System.out.println(">>> Lưu thành công bài viết ID: " + savedPost.getId());
            return ResponseEntity.ok(savedPost);
        } catch (Exception e) {
            System.err.println(">>> LỖI KHI LƯU: " + e.getMessage());
            return ResponseEntity.internalServerError().body("Lỗi DB: " + e.getMessage());
        }
    }

    @DeleteMapping("/post/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable Long postId, @RequestParam Long userId) {
        Post post = postRepository.findById(postId).orElse(null);
        if (post != null && post.getUser().getId().equals(userId)) {
            postRepository.delete(post);
            return ResponseEntity.ok("Xóa thành công");
        }
        return ResponseEntity.status(403).body("Không có quyền");
    }

    @PostMapping("/post/{postId}/like")
    public ResponseEntity<Post> likePost(@PathVariable Long postId, @RequestParam Long userId) {
        Post post = postRepository.findById(postId).orElseThrow();
        Set<Long> likes = post.getLikedUserIds();
        if (likes.contains(userId))
            likes.remove(userId);
        else
            likes.add(userId);
        return ResponseEntity.ok(postRepository.save(post));
    }

    @PostMapping("/post/{postId}/comment")
    public ResponseEntity<Comment> addComment(@PathVariable Long postId, @RequestBody Comment comment) {
        comment.setPostId(postId);
        return ResponseEntity.ok(commentRepository.save(comment));
    }

    @GetMapping("/post/{postId}/comments")
    public List<Comment> getComments(@PathVariable Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
    }
}