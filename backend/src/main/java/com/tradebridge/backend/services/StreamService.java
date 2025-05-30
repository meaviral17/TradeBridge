package com.tradebridge.backend.services;

import io.getstream.chat.java.models.User;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.GregorianCalendar;

@Service
public class StreamService {
    public String generateToken(String userId) {
        GregorianCalendar calendar = new GregorianCalendar();
        calendar.add(GregorianCalendar.MINUTE, 60);
        Date expiration = calendar.getTime();
        return User.createToken(userId, expiration, null);
    }
}
