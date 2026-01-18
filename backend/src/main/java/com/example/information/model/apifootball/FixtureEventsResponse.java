package com.example.information.model.apifootball;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

/**
 * Respuesta de la API para eventos de un partido (goles, tarjetas, sustituciones, etc.)
 * Endpoint: /fixtures/events
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class FixtureEventsResponse {
    
    @JsonProperty("get")
    private String get;
    
    @JsonProperty("parameters")
    private Object parameters;
    
    @JsonProperty("errors")
    private Object errors;
    
    @JsonProperty("results")
    private int results;
    
    @JsonProperty("paging")
    private Paging paging;
    
    @JsonProperty("response")
    private List<Event> response;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Paging {
        private int current;
        private int total;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Event {
        private Time time;
        private Team team;
        private Player player;
        private Player assist;
        private String type;      // "Goal", "Card", "subst", "Var"
        private String detail;    // "Normal Goal", "Penalty", "Yellow Card", "Red Card", "Substitution 1", etc.
        private String comments;  // Comentarios adicionales (puede ser null)
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Time {
        private Integer elapsed;   // Minuto del evento
        private Integer extra;     // Tiempo añadido (puede ser null)
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Team {
        private int id;
        private String name;
        private String logo;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Player {
        private Integer id;
        private String name;
    }
}
