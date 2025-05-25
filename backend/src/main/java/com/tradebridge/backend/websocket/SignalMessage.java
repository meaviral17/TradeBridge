package com.tradebridge.backend.websocket;

public class SignalMessage {
    private String sender;
    private String type; // offer, answer, candidate
    private String room;
    private String payload;

    // Getters and setters
    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getRoom() { return room; }
    public void setRoom(String room) { this.room = room; }

    public String getPayload() { return payload; }
    public void setPayload(String payload) { this.payload = payload; }
}
