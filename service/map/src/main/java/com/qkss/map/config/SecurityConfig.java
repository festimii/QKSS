package com.qkss.map.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 1) Disable CSRF for a stateless REST API
                .csrf(csrf -> csrf.disable())

                // 2) Apply our CORS configuration (bean defined below)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 3) Authorization rules
                .authorizeHttpRequests(auth -> auth
                        // 3a) Always allow preflight OPTIONS under /api/**
                        .requestMatchers(HttpMethod.OPTIONS, "/api/**").permitAll()

                        // 3b) Allow login without a token
                        .requestMatchers(HttpMethod.POST, "/api/pins/admin/login").permitAll()

                        // 3c) Allow GET /api/pins/admin/test for health checks
                        .requestMatchers(HttpMethod.GET, "/api/pins/admin/test").permitAll()

                        // 3d) Allow public GET of all pins
                        .requestMatchers(HttpMethod.GET, "/api/pins/**").permitAll()

                        // 3e) Permit exactly POST /api/pins/admin (no trailing slash)
                        .requestMatchers(HttpMethod.POST, "/api/pins/admin").permitAll()

                        // 3f) Permit DELETE /api/pins/admin/{id}
                        .requestMatchers(HttpMethod.DELETE, "/api/pins/admin/**").permitAll()

                        // 3g) Permit PUT /api/pins/admin/{id}
                        .requestMatchers(HttpMethod.PUT, "/api/pins/admin/**").permitAll(),

                        // 3h) Deny everything else
                        .anyRequest().denyAll()
                )

                // 4) Disable HTTP Basic (we’re not using it)
                .httpBasic(httpBasic -> httpBasic.disable())

                // 5) Disable the default login form (we handle login ourselves)
                .formLogin(form -> form.disable());

        return http.build();
    }

    /**
     * CORS configuration:
     *  - Allow all origins (for dev).
     *  - Allow GET, POST, DELETE, OPTIONS.
     *  - Allow the headers Authorization and Content-Type (and others).
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOriginPatterns(List.of("*"));
        cfg.setAllowedMethods(List.of("GET", "POST", "DELETE", "PUT", "OPTIONS"));
        cfg.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type",
                "Cache-Control",
                "X-Admin-Password"
        ));
        cfg.setAllowCredentials(false); // because we used wildcard origins

        UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
        src.registerCorsConfiguration("/**", cfg);
        return src;
    }
}
