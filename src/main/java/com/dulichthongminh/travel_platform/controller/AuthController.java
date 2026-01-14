package com.dulichthongminh.travel_platform.controller;

import com.dulichthongminh.travel_platform.entity.User;
import com.dulichthongminh.travel_platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private PasswordEncoder encoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        return ResponseEntity.ok(userRepo.save(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        User found = userRepo.findByUsername(user.getUsername());
        if (found != null && encoder.matches(user.getPassword(), found.getPassword())) {
            return ResponseEntity.ok(found);
        }
        return ResponseEntity.status(401).body("Sai tài khoản hoặc mật khẩu");
    }
}