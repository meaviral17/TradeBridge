package com.tradebridge.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws") // WebSocket endpoint
                .setAllowedOrigins("http://localhost:5173") // Allow frontend origin
                .withSockJS(); // Fallback options for browsers that don’t support WebSocket
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic"); // Prefix for outgoing messages
        registry.setApplicationDestinationPrefixes("/app"); // Prefix for messages bound for @MessageMapping
    }
}
