package com.tradebridge.backend.scheduled;

import com.tradebridge.backend.models.Trade;
import com.tradebridge.backend.models.User;
import com.tradebridge.backend.repositories.TradeRepository;
import com.tradebridge.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Component
public class TradePriceScheduler {

    private final TradeRepository tradeRepo;
    private final UserRepository userRepo;

    @Value("${twelvedata.api.key}")
    private String apiKey;

    public TradePriceScheduler(TradeRepository tradeRepo, UserRepository userRepo) {
        this.tradeRepo = tradeRepo;
        this.userRepo = userRepo;
    }

    // 🔁 Runs every 10 minutes
    @Scheduled(fixedRate = 600_000)
    public void fetchAndStore() {
        List<String> symbols = List.of("AAPL", "GOOGL", "TSLA");
        RestTemplate restTemplate = new RestTemplate();
        List<User> users = userRepo.findAll();

        for (String symbol : symbols) {
            try {
                String url = String.format("https://api.twelvedata.com/time_series?symbol=%s&interval=1min&outputsize=1&apikey=%s", symbol, apiKey);
                Map<String, Object> response = restTemplate.getForObject(url, Map.class);

                if (response == null || !response.containsKey("values")) continue;

                List<Map<String, String>> values = (List<Map<String, String>>) response.get("values");
                if (values.isEmpty()) continue;

                Map<String, String> latest = values.get(0);
                double price = Double.parseDouble(latest.get("close"));

                // ✅ Proper timestamp parsing from "2025-05-30 21:44:00"
                String rawDatetime = latest.get("datetime"); // Example: "2025-05-30 21:44:00"
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
                LocalDateTime parsedDate = LocalDateTime.parse(rawDatetime, formatter);

                for (User user : users) {
                    Trade trade = new Trade();
                    trade.setUser(user);
                    trade.setSymbol(symbol);
                    trade.setPrice(price);
                    trade.setMarketPrice(price);
                    trade.setQuantity(10);
                    trade.setTimestamp(parsedDate);

                    tradeRepo.save(trade);
                }
            } catch (Exception e) {
                System.err.println("❌ Error fetching/saving price for " + symbol + ": " + e.getMessage());
            }
        }
    }
}
