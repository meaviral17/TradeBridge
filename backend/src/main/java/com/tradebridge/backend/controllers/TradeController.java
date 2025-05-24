package com.tradebridge.backend.controllers;

import com.opencsv.CSVReader;
import com.tradebridge.backend.models.Trade;
import com.tradebridge.backend.models.User;
import com.tradebridge.backend.repositories.TradeRepository;
import com.tradebridge.backend.repositories.UserRepository;
import com.tradebridge.backend.services.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/trades")
public class TradeController {

    @Autowired
    private TradeRepository tradeRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public List<Trade> getTrades(HttpServletRequest request) {
        String username = getUsernameFromRequest(request);
        User user = userRepo.findByUsername(username).orElseThrow();
        return tradeRepo.findByUser(user);
    }

    @PostMapping
    public Trade createTrade(@RequestBody Trade trade, HttpServletRequest request) {
        String username = getUsernameFromRequest(request);
        User user = userRepo.findByUsername(username).orElseThrow();
        trade.setUser(user);
        trade.setTimestamp(LocalDateTime.now());
        return tradeRepo.save(trade);
    }

    @PostMapping("/upload")
    public String uploadTrades(@RequestParam("file") MultipartFile file, HttpServletRequest request) throws Exception {
        String username = getUsernameFromRequest(request);
        User user = userRepo.findByUsername(username).orElseThrow();

        try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
            String[] line;
            while ((line = reader.readNext()) != null) {
                if (line.length < 3 || line[0].equalsIgnoreCase("symbol")) continue;
                Trade trade = new Trade();
                trade.setUser(user);
                trade.setSymbol(line[0]);
                trade.setQuantity(Double.parseDouble(line[1]));
                trade.setPrice(Double.parseDouble(line[2]));
                trade.setTimestamp(LocalDateTime.now());
                tradeRepo.save(trade);
            }
        }
        return "Trades uploaded successfully.";
    }

    private String getUsernameFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        String token = authHeader.substring(7); // remove "Bearer "
        return jwtUtil.extractUsername(token);
    }
}
