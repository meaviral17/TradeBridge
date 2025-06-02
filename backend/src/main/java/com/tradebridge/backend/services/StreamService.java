package com.tradebridge.backend.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.GregorianCalendar;

@Service
public class StreamService {

    private final ChatClient streamClient;

    public StreamService(
            @Value("${stream.api.key}") String apiKey,
            @Value("${stream.api.secret}") String apiSecret
    ) {
        this.streamClient = new ChatClient(apiKey, apiSecret);
    }

    public String generateToken(String userId) {
        GregorianCalendar calendar = new GregorianCalendar();
        calendar.add(GregorianCalendar.MINUTE, 60);
        Date expiration = calendar.getTime();
        return streamClient.createToken(userId, expiration);
    }
}
