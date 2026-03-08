package com.phenikaa.thesis.audit.aspect;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.phenikaa.thesis.audit.annotation.Auditable;
import com.phenikaa.thesis.audit.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Map;
import java.util.UUID;

@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class AuditLogAspect {

    private final AuditLogService auditLogService;
    private final ObjectMapper objectMapper;

    @AfterReturning(value = "@annotation(auditable)", returning = "result")
    public void auditLog(JoinPoint joinPoint, Auditable auditable, Object result) {
        try {
            String action = auditable.action();
            String entityType = auditable.entityType();
            UUID entityId = extractId(result, joinPoint.getArgs());

            Map<String, Object> newValue = null;
            if (result != null && !action.contains("DELETE")) {
                newValue = convertToMap(result);
            } else if (joinPoint.getArgs().length > 0 && !action.contains("DELETE")) {
                newValue = convertToMap(joinPoint.getArgs()[0]);
            }

            auditLogService.log(action, entityType, entityId, null, newValue);
            log.debug("Audit: {} -> {} (ID: {})", action, entityType, entityId);
        } catch (Exception e) {
            log.error("AuditLog AOP failure in {}: {}", joinPoint.getSignature().getName(), e.getMessage());
        }
    }

    private UUID extractId(Object result, Object[] args) {
        if (result != null) {
            UUID id = tryGetId(result);
            if (id != null) return id;
        }
        for (Object arg : args) {
            if (arg instanceof UUID uuid) return uuid;
            if (arg instanceof String s) {
                try { return UUID.fromString(s); } catch (Exception ignored) {}
            }
        }
        return null;
    }

    private UUID tryGetId(Object obj) {
        if (obj == null) return null;
        // Try getId() — standard JPA entity
        try {
            Object res = obj.getClass().getMethod("getId").invoke(obj);
            if (res instanceof UUID uuid) return uuid;
        } catch (Exception ignored) {}
        // Try id() — Java record
        try {
            Object res = obj.getClass().getMethod("id").invoke(obj);
            if (res instanceof UUID uuid) return uuid;
        } catch (Exception ignored) {}
        return null;
    }

    private Map<String, Object> convertToMap(Object obj) {
        if (obj == null) return null;
        try {
            return objectMapper.convertValue(obj, new TypeReference<>() {});
        } catch (Exception e) {
            return Collections.singletonMap("summary", obj.toString());
        }
    }
}
