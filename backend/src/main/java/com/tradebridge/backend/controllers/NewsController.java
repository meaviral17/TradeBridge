package com.tradebridge.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    private static final String API_KEY = "FATEUrgRpyI7nE1pFtgwAnpIJOr_kEc9";

    @GetMapping
    public ResponseEntity<?> getNews(@RequestParam String symbol) {
        String url = String.format(
            "https://stocknewsapi.com/api/v1?tickers=%s&items=6&token=%s",
            symbol, API_KEY
        );

        try {
            RestTemplate restTemplate = new RestTemplate();
            return ResponseEntity.ok(restTemplate.getForObject(url, Object.class));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching news: " + e.getMessage());
        }
    }
}
