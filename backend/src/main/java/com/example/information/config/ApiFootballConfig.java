package com.example.information.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

/**
 * Configuración para la integración con API-Football
 * https://www.api-football.com/documentation-v3
 */
@Configuration
public class ApiFootballConfig {

    @Value("${api.football.key:}")
    private String apiKey;

    @Value("${api.football.base-url:https://v3.football.api-sports.io}")
    private String baseUrl;

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        // Configurar timeouts más largos para API externa
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10000); // 10 segundos para conectar
        factory.setReadTimeout(30000);    // 30 segundos para leer respuesta
        
        return builder
            .setConnectTimeout(Duration.ofSeconds(10))
            .setReadTimeout(Duration.ofSeconds(30))
            .requestFactory(() -> factory)
            .build();
    }

    public String getApiKey() {
        return apiKey;
    }

    public String getBaseUrl() {
        return baseUrl;
    }
}

