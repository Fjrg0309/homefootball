package com.example.information;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import javax.sql.DataSource;
import java.sql.Connection;

@SpringBootApplication
public class DatabaseTestApplication {

    public static void main(String[] args) {
        SpringApplication.run(DatabaseTestApplication.class, args);
    }

    @Bean
    public CommandLineRunner testConnection(DataSource dataSource) {
        return args -> {
            System.out.println("=====================================");
            System.out.println("PROBANDO CONEXIÓN A LA BASE DE DATOS");
            System.out.println("=====================================");
            
            try (Connection connection = dataSource.getConnection()) {
                System.out.println("✓ Conexión exitosa!");
                System.out.println("✓ Base de datos: " + connection.getCatalog());
                System.out.println("✓ URL: " + connection.getMetaData().getURL());
                System.out.println("✓ Usuario: " + connection.getMetaData().getUserName());
                System.out.println("=====================================");
            } catch (Exception e) {
                System.err.println("✗ Error de conexión:");
                System.err.println("✗ " + e.getMessage());
                e.printStackTrace();
                System.exit(1);
            }
            
            System.exit(0);
        };
    }
}
