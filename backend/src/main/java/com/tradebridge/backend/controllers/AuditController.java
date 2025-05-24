package com.tradebridge.backend.controllers;

import com.tradebridge.backend.models.AuditLog;
import com.tradebridge.backend.repositories.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
public class AuditController {

    @Autowired
    private AuditLogRepository auditRepo;

    @GetMapping
    public List<AuditLog> getLogs(@RequestParam(required = false) String type) {
        if (type != null) {
            return auditRepo.findByTypeIgnoreCase(type);
        }
        return auditRepo.findAll();
    }
}
