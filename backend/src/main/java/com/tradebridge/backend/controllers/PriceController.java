package com.tradebridge.backend.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/trades/price")
public class PriceController {

    @Value("${twelvedata.api.key}")
    private String apiKey;

    @GetMapping("/{symbol}")
    public ResponseEntity<?> getPriceData(@PathVariable String symbol) {
        String url = String.format(
            "https://api.twelvedata.com/time_series?symbol=%s&interval=1min&outputsize=60&apikey=%s",
            symbol, apiKey
        );

        RestTemplate restTemplate = new RestTemplate();
        Map response = restTemplate.getForObject(url, Map.class);

        if (response == null || response.get("values") == null) {
            return ResponseEntity.badRequest().body("Failed to fetch data from TwelveData");
        }

        return ResponseEntity.ok(response.get("values"));
    }
}
