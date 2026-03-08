package com.phenikaa.thesis.audit.mapper;

import com.phenikaa.thesis.audit.dto.AuditLogResponse;
import com.phenikaa.thesis.audit.entity.AuditLog;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AuditLogMapper {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userName", ignore = true) // Resolved in service (fullName logic)
    @Mapping(target = "message", ignore = true)  // Generated dynamically
    AuditLogResponse toResponse(AuditLog log);
}
