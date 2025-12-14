package com.example.information.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configure(http))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                // Permitir acceso público a la consola H2 (solo desarrollo)
                .requestMatchers("/h2-console/**").permitAll()
                // Permitir acceso público a endpoints de autenticación
                .requestMatchers("/api/auth/**").permitAll()
                // Por ahora permitir todos los endpoints de la API (comentar en producción)
                .requestMatchers("/api/**").permitAll()
                // Requerir autenticación para todo lo demás
                .anyRequest().authenticated()
            )
            // Permitir frames para H2 Console (solo desarrollo)
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()));

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
