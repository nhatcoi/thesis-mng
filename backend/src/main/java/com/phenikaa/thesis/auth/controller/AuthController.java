package com.phenikaa.thesis.auth.controller;

import com.phenikaa.thesis.auth.service.UserSyncService;
import com.phenikaa.thesis.user.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserSyncService userSyncService;

    public AuthController(UserSyncService userSyncService) {
        this.userSyncService = userSyncService;
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> me(@AuthenticationPrincipal OidcUser oidcUser) {
        Map<String, Object> info = new LinkedHashMap<>();

        if (oidcUser != null) {
            User localUser = userSyncService.syncFromOidc(oidcUser);

            info.put("source", "oauth2-login");
            info.put("sub", oidcUser.getSubject());
            info.put("preferred_username", oidcUser.getPreferredUsername());
            info.put("email", oidcUser.getEmail());
            info.put("name", oidcUser.getFullName());
            info.put("local_user_id", localUser.getId());
            info.put("local_role", localUser.getRole());
        } else {
            info.put("error", "No authentication principal found");
        }

        return ResponseEntity.ok(info);
    }
}
