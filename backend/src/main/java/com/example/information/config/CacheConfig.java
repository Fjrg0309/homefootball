package com.example.information.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

/**
 * Configuración de caché para optimizar las peticiones a la API de Football
 * y reducir el consumo de llamadas a la API
 */
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager(
            "leagues", "teams", "players", "fixtures", "standings", "teamStats"
        );
        
        cacheManager.setCaffeine(Caffeine.newBuilder()
            .maximumSize(1000)
            .expireAfterWrite(24, TimeUnit.HOURS) // Cache válido por 24 horas
            .recordStats()); // Habilitar estadísticas de caché
        
        return cacheManager;
    }
}
