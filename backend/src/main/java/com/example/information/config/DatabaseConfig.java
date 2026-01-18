package com.example.information.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

/**
 * Configuración de base de datos que maneja automáticamente
 * las URLs de DigitalOcean (postgresql://) y las convierte
 * al formato JDBC requerido (jdbc:postgresql://)
 */
@Configuration
public class DatabaseConfig {

    @Value("${DATABASE_URL:}")
    private String databaseUrl;

    @Value("${DB_USERNAME:}")
    private String username;

    @Value("${DB_PASSWORD:}")
    private String password;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariDataSource dataSource = new HikariDataSource();
        
        String jdbcUrl = convertToJdbcUrl(databaseUrl);
        System.out.println("=== Configurando DataSource ===");
        System.out.println("URL original: " + maskPassword(databaseUrl));
        System.out.println("URL JDBC: " + maskPassword(jdbcUrl));
        
        dataSource.setJdbcUrl(jdbcUrl);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        dataSource.setDriverClassName("org.postgresql.Driver");
        
        // Configuración del pool
        dataSource.setMaximumPoolSize(10);
        dataSource.setMinimumIdle(2);
        dataSource.setConnectionTimeout(20000);
        dataSource.setIdleTimeout(300000);
        dataSource.setMaxLifetime(1200000);
        
        return dataSource;
    }

    /**
     * Convierte URLs de formato DigitalOcean (postgresql://) 
     * a formato JDBC (jdbc:postgresql://)
     */
    private String convertToJdbcUrl(String url) {
        if (url == null || url.isEmpty()) {
            throw new IllegalArgumentException("DATABASE_URL no está configurada");
        }
        
        // Si ya tiene el prefijo jdbc:, devolver tal cual
        if (url.startsWith("jdbc:")) {
            return url;
        }
        
        // Si empieza con postgresql://, añadir jdbc:
        if (url.startsWith("postgresql://")) {
            return "jdbc:" + url;
        }
        
        // Si empieza con postgres://, convertir a jdbc:postgresql://
        if (url.startsWith("postgres://")) {
            return "jdbc:postgresql://" + url.substring("postgres://".length());
        }
        
        // Si no tiene ningún prefijo conocido, asumir que es postgresql
        return "jdbc:postgresql://" + url;
    }

    /**
     * Enmascara la contraseña en la URL para logs seguros
     */
    private String maskPassword(String url) {
        if (url == null) return "null";
        // Buscar patrón usuario:password@ y enmascarar password
        return url.replaceAll("(://[^:]+:)[^@]+(@)", "$1****$2");
    }
}
