package com.example.information.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

/**
 * Configuración de base de datos que maneja automáticamente
 * las URLs de DigitalOcean (postgresql://user:pass@host:port/db) 
 * y las convierte al formato JDBC requerido
 */
@Configuration
public class DatabaseConfig {

    @Value("${DATABASE_URL:}")
    private String databaseUrl;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariDataSource dataSource = new HikariDataSource();
        
        System.out.println("=== Configurando DataSource ===");
        System.out.println("DATABASE_URL recibida: " + maskUrl(databaseUrl));
        
        try {
            DatabaseCredentials creds = parseDigitalOceanUrl(databaseUrl);
            
            System.out.println("URL JDBC parseada: " + maskUrl(creds.jdbcUrl));
            System.out.println("Usuario: " + creds.username);
            System.out.println("Host detectado: " + creds.host);
            
            dataSource.setJdbcUrl(creds.jdbcUrl);
            dataSource.setUsername(creds.username);
            dataSource.setPassword(creds.password);
            dataSource.setDriverClassName("org.postgresql.Driver");
            
        } catch (Exception e) {
            System.err.println("ERROR parseando DATABASE_URL: " + e.getMessage());
            throw new RuntimeException("No se pudo parsear DATABASE_URL: " + e.getMessage(), e);
        }
        
        // Configuración del pool
        dataSource.setMaximumPoolSize(10);
        dataSource.setMinimumIdle(2);
        dataSource.setConnectionTimeout(30000);
        dataSource.setIdleTimeout(300000);
        dataSource.setMaxLifetime(1200000);
        
        return dataSource;
    }

    /**
     * Parsea la URL de DigitalOcean y extrae los componentes
     * Formato entrada: postgresql://user:password@host:port/database?params
     * Formato salida JDBC: jdbc:postgresql://host:port/database?params
     */
    private DatabaseCredentials parseDigitalOceanUrl(String url) throws URISyntaxException {
        if (url == null || url.isEmpty()) {
            throw new IllegalArgumentException("DATABASE_URL no está configurada");
        }
        
        // Si ya es formato JDBC completo, intentar extraer credenciales de la URL
        if (url.startsWith("jdbc:")) {
            // jdbc:postgresql://user:pass@host:port/db
            String withoutJdbc = url.substring(5); // quitar "jdbc:"
            return parsePostgresUrl(withoutJdbc);
        }
        
        return parsePostgresUrl(url);
    }
    
    private DatabaseCredentials parsePostgresUrl(String url) throws URISyntaxException {
        // Normalizar: postgres:// -> postgresql://
        if (url.startsWith("postgres://")) {
            url = "postgresql" + url.substring("postgres".length());
        }
        
        // Reemplazar postgresql:// con http:// temporalmente para usar URI parser
        String httpUrl = url.replace("postgresql://", "http://");
        URI uri = new URI(httpUrl);
        
        String host = uri.getHost();
        int port = uri.getPort();
        String path = uri.getPath(); // /database
        String query = uri.getQuery(); // sslmode=require
        String userInfo = uri.getUserInfo(); // user:password
        
        if (host == null || host.isEmpty()) {
            throw new IllegalArgumentException("No se pudo extraer el host de la URL");
        }
        
        // Extraer usuario y contraseña
        String username = "";
        String password = "";
        if (userInfo != null && userInfo.contains(":")) {
            String[] parts = userInfo.split(":", 2);
            username = parts[0];
            password = parts[1];
        }
        
        // Construir URL JDBC sin credenciales (se pasan por separado)
        StringBuilder jdbcUrl = new StringBuilder("jdbc:postgresql://");
        jdbcUrl.append(host);
        if (port > 0) {
            jdbcUrl.append(":").append(port);
        }
        if (path != null && !path.isEmpty()) {
            jdbcUrl.append(path);
        }
        if (query != null && !query.isEmpty()) {
            jdbcUrl.append("?").append(query);
        }
        
        DatabaseCredentials creds = new DatabaseCredentials();
        creds.jdbcUrl = jdbcUrl.toString();
        creds.username = username;
        creds.password = password;
        creds.host = host;
        
        return creds;
    }

    /**
     * Enmascara la URL para logs seguros
     */
    private String maskUrl(String url) {
        if (url == null) return "null";
        // Buscar patrón :password@ y enmascarar
        return url.replaceAll("(://[^:]+:)[^@]+(@)", "$1****$2");
    }
    
    private static class DatabaseCredentials {
        String jdbcUrl;
        String username;
        String password;
        String host;
    }
}
