package com.example.information.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

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
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    public String getApiKey() {
        return apiKey;
    }

    public String getBaseUrl() {
        return baseUrl;
    }
}
