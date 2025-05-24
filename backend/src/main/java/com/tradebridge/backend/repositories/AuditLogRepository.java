package com.tradebridge.backend.repositories;

import com.tradebridge.backend.models.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByTypeIgnoreCase(String type);
}
