package com.phenikaa.thesis.auth.service;

import com.phenikaa.thesis.user.entity.User;
import com.phenikaa.thesis.user.entity.enums.UserRole;
import com.phenikaa.thesis.user.entity.enums.UserStatus;
import com.phenikaa.thesis.user.repository.UserRepository;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

/**
 * Syncs the OIDC user info from Zitadel into the local `users` table.
 * Called after every successful login to keep local data up-to-date.
 */
@Service
public class UserSyncService {

    private final UserRepository userRepository;

    public UserSyncService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User syncFromOidc(OidcUser oidcUser) {
        String sub = oidcUser.getSubject();
        String email = oidcUser.getEmail();
        String givenName = oidcUser.getGivenName() != null ? oidcUser.getGivenName() : "";
        String familyName = oidcUser.getFamilyName() != null ? oidcUser.getFamilyName() : "";
        String preferredUsername = oidcUser.getPreferredUsername() != null
                ? oidcUser.getPreferredUsername()
                : email;

        User user = userRepository.findByExternalId(sub)
                .or(() -> userRepository.findByEmail(email))
                .orElse(null);

        if (user == null) {
            user = User.builder()
                    .externalId(sub)
                    .username(preferredUsername)
                    .email(email)
                    .firstName(givenName)
                    .lastName(familyName)
                    .role(UserRole.STUDENT)
                    .status(UserStatus.ACTIVE)
                    .lastLoginAt(OffsetDateTime.now())
                    .build();
        } else {
            if (user.getExternalId() == null) {
                user.setExternalId(sub);
            }
            user.setFirstName(givenName);
            user.setLastName(familyName);
            user.setLastLoginAt(OffsetDateTime.now());
        }

        return userRepository.save(user);
    }
}
