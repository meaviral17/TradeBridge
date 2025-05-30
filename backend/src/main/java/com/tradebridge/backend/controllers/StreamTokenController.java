package com.tradebridge.backend.controllers;

import com.tradebridge.backend.services.JwtUtil;
import com.tradebridge.backend.services.StreamService;
import com.tradebridge.backend.models.User;
import com.tradebridge.backend.repositories.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/stream")
public class StreamTokenController {

    @Autowired
    private StreamService streamService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/token")
    public Map<String, String> getToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing Authorization header");
        }

        String jwt = authHeader.substring(7);
        String username = jwtUtil.extractUsername(jwt);
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

        String streamToken = streamService.generateToken(username);
        return Map.of("token", streamToken, "userId", username);
    }
}
