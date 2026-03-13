package com.phenikaa.thesis.auth.service;

import com.phenikaa.thesis.user.entity.User;
import com.phenikaa.thesis.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Map;

@Service
@lombok.extern.slf4j.Slf4j
public class UserSyncService {

    private final UserRepository userRepository;

    public UserSyncService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    @org.springframework.cache.annotation.Cacheable(value = "users", key = "#claims.get('sub')", unless = "#result == null")
    public User syncFromClaims(Map<String, Object> claims) {
        log.debug("==> [DB Lookup] Authenticating and syncing user from DB for sub: {}", claims.get("sub"));
        String sub = str(claims, "sub");
        String email = str(claims, "email");
        final String givenName = str(claims, "given_name") != null ? str(claims, "given_name") : "";
        final String familyName =FamilyName(claims);
        final String username = str(claims, "preferred_username") != null
                ? str(claims, "preferred_username")
                : email;

        User user = userRepository.findByExternalId(sub)
                .or(() -> userRepository.findByEmail(email))
                .or(() -> userRepository.findByUsername(username))
                .orElse(null);

        if (user == null) {
            return null;
        }

        // --- OPTIMIZATION: Skip save if no critical data changed and sync was recent ---
        boolean needsUpdate = false;
        
        // 1. Check external ID mapping
        if (user.getExternalId() == null) {
            user.setExternalId(sub);
            needsUpdate = true;
        }

        // 2. Sync basic info if changed
        if (!givenName.equals(user.getFirstName())) {
            user.setFirstName(givenName);
            needsUpdate = true;
        }
        if (!familyName.equals(user.getLastName())) {
            user.setLastName(familyName);
            needsUpdate = true;
        }

        // 3. Update lastLoginAt only if it's been more than 1 hour since last update
        // to avoid excessive DB writes on every API call.
        OffsetDateTime now = OffsetDateTime.now();
        if (user.getLastLoginAt() == null || user.getLastLoginAt().isBefore(now.minusHours(1))) {
            user.setLastLoginAt(now);
            needsUpdate = true;
        }

        if (needsUpdate) {
            return userRepository.save(user);
        }

        return user;
    }

    private String FamilyName(Map<String, Object> claims) {
        return str(claims, "family_name") != null ? str(claims, "family_name") : "";
    }

    private static String str(Map<String, Object> m, String key) {
        Object v = m.get(key);
        return v != null ? v.toString() : null;
    }
}
