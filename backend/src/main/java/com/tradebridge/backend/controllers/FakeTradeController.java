package com.tradebridge.backend.controllers;

import com.tradebridge.backend.models.Trade;
import com.tradebridge.backend.models.User;
import com.tradebridge.backend.repositories.TradeRepository;
import com.tradebridge.backend.repositories.UserRepository;
import com.tradebridge.backend.services.StockPriceService;
import com.tradebridge.backend.services.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/demo")
public class FakeTradeController {

    @Autowired
    private TradeRepository tradeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StockPriceService stockPriceService;

    @Autowired
    private JwtUtil jwtUtil;

@PostMapping("/upload-csv")
public String uploadCSV(@RequestParam("file") MultipartFile file, HttpServletRequest request) throws Exception {
    String authHeader = request.getHeader("Authorization");
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        throw new RuntimeException("Missing Authorization header");
    }

    String jwt = authHeader.substring(7);
    String username = jwtUtil.extractUsername(jwt);
    User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

    try (var reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
        String line;
        boolean skipHeader = true;
        while ((line = reader.readLine()) != null) {
            if (skipHeader && line.toLowerCase().contains("symbol")) {
                skipHeader = false;
                continue;
            }

            String[] parts = line.split(",");
            if (parts.length < 3) continue;

            String symbol = parts[0].trim();
            double qty = Double.parseDouble(parts[1].trim());
            double price = Double.parseDouble(parts[2].trim());

            Trade t = new Trade();
            t.setUser(user);
            t.setSymbol(symbol);
            t.setQuantity(qty);
            t.setPrice(price);
            t.setMarketPrice(stockPriceService.getLivePrice(symbol));
            t.setTimestamp(LocalDateTime.now());

            tradeRepository.save(t);
        }
    }

    return "✅ CSV uploaded and trades saved!";
}


    @DeleteMapping("/clear")
    public String deleteUserTrades(HttpServletRequest request) {
        String jwt = request.getHeader("Authorization").substring(7);
        String username = jwtUtil.extractUsername(jwt);
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        tradeRepository.deleteAllByUser(user);
        return "✅ Deleted all trades for user: " + username;
    }

    @GetMapping("/all")
    public List<Trade> getUserTrades(HttpServletRequest request) {
        String jwt = request.getHeader("Authorization").substring(7);
        String username = jwtUtil.extractUsername(jwt);
        User user = userRepository.findByUsername(username).orElseThrow();
        return tradeRepository.findByUser(user);
    }
}
