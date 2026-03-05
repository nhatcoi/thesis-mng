package com.phenikaa.thesis.auth.dto;

import java.util.List;
import java.util.UUID;

public record AuthCheckResponse(
        boolean allowed,
        String reasonCode,
        String message,
        UUID localUserId,
        String localRole,
        List<String> tokenRoles
) {
    public static AuthCheckResponse allow(UUID userId, String localRole, List<String> tokenRoles) {
        return new AuthCheckResponse(true, "OK", "OK", userId, localRole, tokenRoles);
    }

    public static AuthCheckResponse deny(String reasonCode, String message, List<String> tokenRoles) {
        return new AuthCheckResponse(false, reasonCode, message, null, null, tokenRoles);
    }
}

