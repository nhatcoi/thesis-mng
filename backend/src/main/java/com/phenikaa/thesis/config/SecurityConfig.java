package com.phenikaa.thesis.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationManagerResolver;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.DefaultOAuth2AuthenticatedPrincipal;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationProvider;
import org.springframework.security.oauth2.server.resource.authentication.OpaqueTokenAuthenticationProvider;
import org.springframework.security.oauth2.server.resource.introspection.NimbusOpaqueTokenIntrospector;
import org.springframework.security.oauth2.server.resource.introspection.OpaqueTokenIntrospector;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Lazy;
import org.springframework.cache.Cache;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManager;
import java.time.Duration;

import jakarta.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.stream.Collectors;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    static final String ROLES_CLAIM = "urn:zitadel:iam:org:project:roles";

    private final CorsConfigurationSource corsConfigurationSource;
    private final CacheManager cacheManager;

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    private String issuerUri;

    @Value("${zitadel.introspection.client-id}")
    private String introspectionClientId;

    @Value("${zitadel.introspection.client-secret}")
    private String introspectionClientSecret;

    public SecurityConfig(CorsConfigurationSource corsConfigurationSource, @Lazy CacheManager cacheManager) {
        this.corsConfigurationSource = corsConfigurationSource;
        this.cacheManager = cacheManager;
    }

    private static final String[] PUBLIC_PATHS = {
            "/actuator/health",
            "/actuator/info",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/ws/**",
            "/uploads/**",
            "/error"
    };

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(PUBLIC_PATHS).permitAll()
                        .anyRequest().authenticated())
                .oauth2ResourceServer(oauth2 -> oauth2
                        .authenticationManagerResolver(tokenAuthManagerResolver()));
        return http.build();
    }

    /**
     * Supports both JWT and opaque tokens:
     * - Token has dots (xxx.yyy.zzz) → validate as JWT locally via JWKS
     * - Token is opaque → validate via Zitadel introspection endpoint
     */
    @Bean
    public AuthenticationManagerResolver<HttpServletRequest> tokenAuthManagerResolver() {
        AuthenticationManager jwtAuth = jwtAuthManager();
        AuthenticationManager opaqueAuth = opaqueAuthManager();

        return request -> {
            String header = request.getHeader("Authorization");
            if (header != null && header.startsWith("Bearer ")) {
                String token = header.substring(7);
                long dotCount = token.chars().filter(c -> c == '.').count();
                if (dotCount == 2) {
                    return jwtAuth;
                }
            }
            return opaqueAuth;
        };
    }

    private AuthenticationManager jwtAuthManager() {
        JwtDecoder decoder = JwtDecoders.fromIssuerLocation(issuerUri);
        JwtAuthenticationProvider provider = new JwtAuthenticationProvider(decoder);

        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwt -> extractAuthorities(jwt.getClaimAsMap(ROLES_CLAIM)));
        provider.setJwtAuthenticationConverter(converter);

        return new ProviderManager(provider);
    }

    private AuthenticationManager opaqueAuthManager() {
        String introspectUri = issuerUri + "/oauth/v2/introspect";
        
        // --- OPTIMIZATION: Pooled RestTemplate for Introspection ---
        PoolingHttpClientConnectionManager connectionManager = new PoolingHttpClientConnectionManager();
        connectionManager.setMaxTotal(50);
        connectionManager.setDefaultMaxPerRoute(20);

        CloseableHttpClient httpClient = HttpClients.custom()
                .setConnectionManager(connectionManager)
                .build();

        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory(httpClient);
        factory.setConnectTimeout(Duration.ofSeconds(2));
        factory.setConnectionRequestTimeout(Duration.ofSeconds(2));
        
        RestTemplate restTemplate = new RestTemplate(factory);
        // Add basic auth for Zitadel introspection
        restTemplate.getInterceptors().add((request, body, execution) -> {
            String auth = introspectionClientId + ":" + introspectionClientSecret;
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());
            request.getHeaders().add("Authorization", "Basic " + encodedAuth);
            return execution.execute(request, body);
        });
        
        NimbusOpaqueTokenIntrospector delegate = new NimbusOpaqueTokenIntrospector(
                introspectUri, restTemplate);

        OpaqueTokenIntrospector cachedDelegate = new CachedIntrospector(delegate, cacheManager);

        OpaqueTokenIntrospector withRoles = token -> {
            OAuth2AuthenticatedPrincipal p = cachedDelegate.introspect(token);
            Collection<GrantedAuthority> authorities = extractAuthorities(p.getAttribute(ROLES_CLAIM));
            return new DefaultOAuth2AuthenticatedPrincipal(
                    p.getName(), p.getAttributes(), authorities);
        };

        return new ProviderManager(new OpaqueTokenAuthenticationProvider(withRoles));
    }

    private static Collection<GrantedAuthority> extractAuthorities(Object rolesObj) {
        if (!(rolesObj instanceof Map<?, ?> roles) || roles.isEmpty()) {
            return Collections.emptyList();
        }
        return roles.keySet().stream()
                .map(k -> new SimpleGrantedAuthority("ROLE_" + k.toString().toUpperCase()))
                .collect(Collectors.toList());
    }

    private static class CachedIntrospector implements OpaqueTokenIntrospector {
        private final OpaqueTokenIntrospector delegate;
        private final Cache cache;
        private final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(CachedIntrospector.class);

        CachedIntrospector(OpaqueTokenIntrospector delegate, CacheManager cacheManager) {
            this.delegate = delegate;
            this.cache = cacheManager.getCache("introspections");
        }

        @Override
        public OAuth2AuthenticatedPrincipal introspect(String token) {
            if (cache != null) {
                OAuth2AuthenticatedPrincipal cached = cache.get(token, OAuth2AuthenticatedPrincipal.class);
                if (cached != null) {
                    return cached;
                }
            }

            long start = System.currentTimeMillis();
            OAuth2AuthenticatedPrincipal principal = delegate.introspect(token);
            long duration = System.currentTimeMillis() - start;
            log.debug("Opaque token introspected in {}ms", duration);

            if (cache != null && principal != null) {
                cache.put(token, principal);
            }
            return principal;
        }
    }
}
