package com.dulichthongminh.travel_platform.repository;

import com.dulichthongminh.travel_platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Tìm kiếm người dùng theo tên đăng nhập (phục vụ đăng nhập sau này)
    User findByUsername(String username);
}