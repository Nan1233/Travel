package com.dulichthongminh.travel_platform.service;

import com.dulichthongminh.travel_platform.entity.User;
import com.dulichthongminh.travel_platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(User user) {
        // Mã hóa mật khẩu trước khi lưu vào CSDL [cite: 35]
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
}