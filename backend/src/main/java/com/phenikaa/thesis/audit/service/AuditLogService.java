package com.phenikaa.thesis.audit.service;

import com.phenikaa.thesis.audit.dto.AuditLogResponse;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface AuditLogService {
    void log(String action, String entityType, UUID entityId, Map<String, Object> oldValue, Map<String, Object> newValue);
    List<AuditLogResponse> getMyHistory();
    List<AuditLogResponse> getGlobalHistory();
}
