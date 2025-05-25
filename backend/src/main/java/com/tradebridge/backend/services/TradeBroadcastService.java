package com.tradebridge.backend.services;

import com.tradebridge.backend.models.Trade;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class TradeBroadcastService {

    private final SimpMessagingTemplate messagingTemplate;

    public TradeBroadcastService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void broadcastTrade(Trade trade) {
        messagingTemplate.convertAndSend("/topic/trades", trade);
    }
}
