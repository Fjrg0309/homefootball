package com.example.information.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuración Web MVC
 * NOTA: CORS está configurado en SecurityConfig.java para evitar conflictos
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    // CORS deshabilitado aquí - se maneja en SecurityConfig
}
