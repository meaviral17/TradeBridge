package com.tradebridge.backend.controllers;

import com.opencsv.CSVReader;
import com.tradebridge.backend.models.Trade;
import com.tradebridge.backend.models.User;
import com.tradebridge.backend.repositories.TradeRepository;
import com.tradebridge.backend.repositories.UserRepository;
import com.tradebridge.backend.services.JwtUtil;
import com.tradebridge.backend.services.StockPriceService;
import com.tradebridge.backend.services.TradeBroadcastService;
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
    private StockPriceService stockPriceService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private TradeBroadcastService tradeBroadcast;

    // GET all trades for authenticated user
    @GetMapping
    public List<Trade> getTrades(HttpServletRequest request) {
        String username = getUsernameFromRequest(request);
        User user = userRepo.findByUsername(username).orElseThrow();
        return tradeRepo.findByUser(user);
    }
    // GET /api/trades/price/AAPL
    @GetMapping("/price/{symbol}")
    public Double getPrice(@PathVariable String symbol) {
        return stockPriceService.getLivePrice(symbol);
    }

    // POST a single trade
    @PostMapping
    public Trade createTrade(@RequestBody Trade trade, HttpServletRequest request) {
        String username = getUsernameFromRequest(request);
        User user = userRepo.findByUsername(username).orElseThrow();
    
        // 🔧 Fix: Associate user to trade
        trade.setUser(user);
    
        // Set current market price
        Double marketPrice = stockPriceService.getLivePrice(trade.getSymbol());
        trade.setMarketPrice(marketPrice);
    
        Trade savedTrade = tradeRepo.save(trade);
        tradeBroadcast.broadcastTrade(savedTrade);
    
        return savedTrade;
    }
    

    // POST upload CSV
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

                Trade savedTrade = tradeRepo.save(trade);
                tradeBroadcast.broadcastTrade(savedTrade); // ✅ Broadcast each trade live
            }
        }

        return "Trades uploaded successfully.";
    }

    // Extract username from JWT token in Authorization header
    private String getUsernameFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }
        String token = authHeader.substring(7); // Remove "Bearer "
        return jwtUtil.extractUsername(token);
    }
}
