package com.tradebridge.backend.websocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
//import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class SignalController {

    private final SimpMessagingTemplate messagingTemplate;

    public SignalController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/signal")
    public void handleSignal(@Payload SignalMessage message) {
        // Broadcast to everyone in the room except sender
        messagingTemplate.convertAndSend("/topic/signals/" + message.getRoom(), message);
    }
}
