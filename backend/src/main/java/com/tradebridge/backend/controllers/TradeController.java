package com.tradebridge.backend.controllers;

import com.opencsv.CSVReader;
import com.tradebridge.backend.models.Trade;
import com.tradebridge.backend.models.User;
import com.tradebridge.backend.repositories.TradeRepository;
import com.tradebridge.backend.repositories.UserRepository;
import com.tradebridge.backend.services.StockPriceService;
import com.tradebridge.backend.services.TradeBroadcastService;
import com.tradebridge.backend.services.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/trades")
public class TradeController {

    @Autowired private TradeRepository tradeRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private StockPriceService stockPriceService;
    @Autowired private TradeBroadcastService broadcastService;
    @Autowired private JwtUtil jwtUtil;

    // ✅ Upload trades via CSV
    @PostMapping("/upload")
    public String uploadTrades(@RequestParam("file") MultipartFile file, HttpServletRequest request) throws Exception {
        String jwt = request.getHeader("Authorization").substring(7);
        String username = jwtUtil.extractUsername(jwt);
        User user = userRepo.findByUsername(username).orElseThrow();

        try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
            String[] line;
            boolean firstLine = true;

            while ((line = reader.readNext()) != null) {
                if (firstLine && "symbol".equalsIgnoreCase(line[0])) {
                    firstLine = false;
                    continue; // skip header
                }

                if (line.length < 3) continue;

                try {
                    Trade trade = new Trade();
                    trade.setSymbol(line[0].trim());
                    trade.setQuantity(Double.parseDouble(line[1].trim()));
                    trade.setPrice(Double.parseDouble(line[2].trim()));
                    trade.setTimestamp(LocalDateTime.now());
                    trade.setUser(user);

                    // Optional: Fetch live market price
                    Double marketPrice = stockPriceService.getLivePrice(line[0].trim());
                    trade.setMarketPrice(marketPrice);

                    Trade saved = tradeRepo.save(trade);
                    broadcastService.broadcastTrade(saved); // ✅ send to WebSocket/live chart
                } catch (Exception e) {
                    System.err.println("Skipping row: " + Arrays.toString(line) + " due to error: " + e.getMessage());
                }
            }
        }

        return "✅ Trades uploaded successfully.";
    }

    // ✅ Get all trades
    @GetMapping
    public List<Trade> getMyTrades(HttpServletRequest request) {
        String jwt = request.getHeader("Authorization").substring(7);
        String username = jwtUtil.extractUsername(jwt);
        User user = userRepo.findByUsername(username).orElseThrow();
        return tradeRepo.findByUser(user);
    }

    // ✅ Delete all trades
    @DeleteMapping
    public ResponseEntity<?> deleteAll(HttpServletRequest request) {
        String jwt = request.getHeader("Authorization").substring(7);
        String username = jwtUtil.extractUsername(jwt);
        User user = userRepo.findByUsername(username).orElseThrow();
        tradeRepo.deleteAllByUser(user);
        return ResponseEntity.ok("Deleted all trades for user");
    }

    // ✅ Edit a trade inline
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTrade(@PathVariable Long id, @RequestBody Trade updatedTrade, HttpServletRequest request) {
        String jwt = request.getHeader("Authorization").substring(7);
        String username = jwtUtil.extractUsername(jwt);
        User user = userRepo.findByUsername(username).orElseThrow();

        Optional<Trade> optional = tradeRepo.findById(id);
        if (optional.isEmpty()) return ResponseEntity.notFound().build();

        Trade trade = optional.get();
        if (!trade.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Unauthorized");
        }

        trade.setSymbol(updatedTrade.getSymbol());
        trade.setPrice(updatedTrade.getPrice());
        trade.setQuantity(updatedTrade.getQuantity());
        trade.setTimestamp(updatedTrade.getTimestamp());

        tradeRepo.save(trade);
        return ResponseEntity.ok(trade);
    }
}
