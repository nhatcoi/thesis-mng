package com.phenikaa.thesis.auth.service;

import com.phenikaa.thesis.common.exception.ResourceNotFoundException;
import com.phenikaa.thesis.user.entity.User;
import com.phenikaa.thesis.user.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

/**
 * Resolves the currently authenticated user (session or JWT) to the local User entity.
 */
@Service
public class CurrentUserService {

    private final UserRepository userRepository;
    private final UserSyncService userSyncService;

    public CurrentUserService(UserRepository userRepository, UserSyncService userSyncService) {
        this.userRepository = userRepository;
        this.userSyncService = userSyncService;
    }

    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new IllegalStateException("No authenticated user in security context");
        }

        Object principal = auth.getPrincipal();

        if (principal instanceof OidcUser oidcUser) {
            return userSyncService.syncFromOidc(oidcUser);
        }

        if (principal instanceof Jwt jwt) {
            String sub = jwt.getSubject();
            return userRepository.findByExternalId(sub)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "User", "external_id", sub));
        }

        throw new IllegalStateException("Unsupported principal type: " + principal.getClass());
    }
}
