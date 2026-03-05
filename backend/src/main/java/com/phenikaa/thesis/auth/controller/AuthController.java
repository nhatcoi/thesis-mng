package com.phenikaa.thesis.auth.controller;

import com.phenikaa.thesis.auth.service.UserSyncService;
import com.phenikaa.thesis.common.dto.ApiResponse;
import com.phenikaa.thesis.user.entity.User;
import com.phenikaa.thesis.user.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final String ROLES_CLAIM = "urn:zitadel:iam:org:project:roles";

    private final UserSyncService userSyncService;
    private final UserRepository userRepository;

    public AuthController(UserSyncService userSyncService, UserRepository userRepository) {
        this.userSyncService = userSyncService;
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body(ApiResponse.error("Not authenticated"));
        }

        Object principal = auth.getPrincipal();
        Map<String, Object> info = new LinkedHashMap<>();

        if (principal instanceof OidcUser oidcUser) {
            User localUser = userSyncService.syncFromOidc(oidcUser);
            info.put("sub", oidcUser.getSubject());
            info.put("preferred_username", oidcUser.getPreferredUsername());
            info.put("email", oidcUser.getEmail());
            info.put("name", oidcUser.getFullName());
            info.put("local_user_id", localUser.getId());
            info.put("local_role", localUser.getRole());
            info.put("roles", extractRolesFromOidc(oidcUser));

        } else if (principal instanceof Jwt jwt) {
            String sub = jwt.getSubject();
            User localUser = userRepository.findByExternalId(sub).orElse(null);

            info.put("sub", sub);
            info.put("preferred_username", jwt.getClaimAsString("preferred_username"));
            info.put("email", jwt.getClaimAsString("email"));
            info.put("name", jwt.getClaimAsString("name"));
            info.put("local_user_id", localUser != null ? localUser.getId() : null);
            info.put("local_role", localUser != null ? localUser.getRole() : null);
            info.put("roles", extractRolesFromJwt(jwt));

        } else {
            return ResponseEntity.status(401).body(ApiResponse.error("Unknown principal type"));
        }

        return ResponseEntity.ok(ApiResponse.ok(info));
    }

    @SuppressWarnings("unchecked")
    private List<String> extractRolesFromJwt(Jwt jwt) {
        Map<String, Object> rolesMap = jwt.getClaimAsMap(ROLES_CLAIM);
        if (rolesMap == null) return Collections.emptyList();
        return rolesMap.keySet().stream().map(String::toUpperCase).sorted().toList();
    }

    @SuppressWarnings("unchecked")
    private List<String> extractRolesFromOidc(OidcUser oidcUser) {
        Object rolesObj = oidcUser.getClaims().get(ROLES_CLAIM);
        if (rolesObj instanceof Map<?, ?> rolesMap) {
            return rolesMap.keySet().stream()
                    .map(k -> k.toString().toUpperCase())
                    .sorted()
                    .toList();
        }
        return Collections.emptyList();
    }
}
