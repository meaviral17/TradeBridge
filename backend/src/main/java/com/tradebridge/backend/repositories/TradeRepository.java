package com.tradebridge.backend.repositories;

import com.tradebridge.backend.models.Trade;
import com.tradebridge.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TradeRepository extends JpaRepository<Trade, Long> {
    List<Trade> findByUser(User user);
    void deleteAllByUser(User user);

}
