package com.example.information.web;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller de debug para verificar que Spring Boot funciona
 */
@RestController
@RequestMapping("/api/debug")
@CrossOrigin(origins = "*")
public class DebugController {

    @Value("${api.football.key:NOT_SET}")
    private String apiKey;

    @Value("${api.football.base-url:NOT_SET}")
    private String baseUrl;

    @GetMapping("/ping")
    public ResponseEntity<Map<String, Object>> ping() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "ok");
        response.put("timestamp", System.currentTimeMillis());
        response.put("message", "Backend is running!");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/config")
    public ResponseEntity<Map<String, Object>> config() {
        Map<String, Object> response = new HashMap<>();
        response.put("apiKeyConfigured", apiKey != null && !apiKey.isEmpty() && !apiKey.equals("NOT_SET"));
        response.put("apiKeyLength", apiKey != null ? apiKey.length() : 0);
        response.put("baseUrl", baseUrl);
        return ResponseEntity.ok(response);
    }
}
