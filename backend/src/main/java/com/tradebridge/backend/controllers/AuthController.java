package com.tradebridge.backend.controllers;

import com.tradebridge.backend.dtos.AuthRequest;
import com.tradebridge.backend.dtos.AuthResponse;
import com.tradebridge.backend.models.AuditLog;
import com.tradebridge.backend.models.User;
import com.tradebridge.backend.repositories.AuditLogRepository;
import com.tradebridge.backend.repositories.UserRepository;
import com.tradebridge.backend.services.JwtUtil;
import com.tradebridge.backend.services.MyUserDetailsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private AuthenticationManager authManager;
    @Autowired private MyUserDetailsService userService;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private UserRepository userRepo;
    @Autowired private AuditLogRepository auditRepo;

    @PostMapping("/register")
    public String register(@RequestBody AuthRequest request) {
        if (userRepo.findByUsername(request.getUsername()).isPresent()) {
            return "Username already exists.";
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepo.save(user);

        return "User registered successfully.";
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        System.out.println("LOGIN ATTEMPT: " + request.getUsername());
        System.out.println("RAW password: " + request.getPassword());

        var userOpt = userRepo.findByUsername(request.getUsername());
        if (userOpt.isEmpty()) {
            System.out.println("❌ No such user in DB");
            throw new RuntimeException("User not found");
        }

        var user = userOpt.get();
        System.out.println("✔️ User exists. Hashed password in DB: " + user.getPassword());

        boolean match = passwordEncoder.matches(request.getPassword(), user.getPassword());
        System.out.println("✅ passwordEncoder.matches() result: " + match);

        if (!match) {
            System.out.println("❌ Password mismatch");
        }

        try {
            authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            System.out.println("❌ Spring authentication failed: " + e.getMessage());
            throw new RuntimeException("Invalid credentials");
        }

        UserDetails userDetails = userService.loadUserByUsername(request.getUsername());
        String token = jwtUtil.generateToken(userDetails);

        AuditLog log = new AuditLog();
        log.setType("LOGIN");
        log.setFromUser(request.getUsername());
        auditRepo.save(log);

        System.out.println("✅ Login successful. JWT issued.");

        return new AuthResponse(token);
    }
}
