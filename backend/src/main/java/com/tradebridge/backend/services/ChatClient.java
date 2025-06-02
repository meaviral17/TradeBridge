package com.tradebridge.backend.services;

import java.util.Date;
import java.util.UUID;

public class ChatClient {

    private final String apiKey;
    private final String apiSecret;

    public ChatClient(String apiKey, String apiSecret) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
    }

    public String createToken(String userId, Date expiration) {
        // Simulate a token for testing or offline use
        // In real world, you would generate a JWT here
        return "FAKE_TOKEN_" + UUID.randomUUID().toString();
    }
}
