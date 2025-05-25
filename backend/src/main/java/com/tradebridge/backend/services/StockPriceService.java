package com.tradebridge.backend.services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class StockPriceService {

    private final String API_KEY = "20dc46df5ec242d0891bdf07c276b5e5";
    private final String BASE_URL = "https://api.twelvedata.com/price?symbol=%s&apikey=%s";
    private final RestTemplate restTemplate = new RestTemplate();

    public Double getLivePrice(String symbol) {
        try {
            String url = String.format(BASE_URL, symbol, API_KEY);
            StockPriceResponse response = restTemplate.getForObject(url, StockPriceResponse.class);
            return response != null && response.price != null ? Double.parseDouble(response.price) : null;
        } catch (Exception e) {
            System.err.println("❌ Error fetching price for symbol '" + symbol + "': " + e.getMessage());
            return null;
        }
    }

    private static class StockPriceResponse {
        public String price;
    }
}
