package com.tradebridge.backend.services;

import com.tradebridge.backend.models.Trade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class TradeBroadcastService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void broadcastTrade(Trade trade) {
        messagingTemplate.convertAndSend("/topic/trades", trade);
    }
}
