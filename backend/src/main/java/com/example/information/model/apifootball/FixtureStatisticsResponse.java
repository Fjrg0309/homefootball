package com.example.information.model.apifootball;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

/**
 * Respuesta de la API para estadísticas de un partido
 * Endpoint: /fixtures/statistics
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class FixtureStatisticsResponse {
    
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
    private List<TeamStatistics> response;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Paging {
        private int current;
        private int total;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TeamStatistics {
        private Team team;
        private List<Statistic> statistics;
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
    public static class Statistic {
        private String type;   // "Shots on Goal", "Shots off Goal", "Total Shots", "Blocked Shots", 
                               // "Shots insidebox", "Shots outsidebox", "Fouls", "Corner Kicks",
                               // "Offsides", "Ball Possession", "Yellow Cards", "Red Cards",
                               // "Goalkeeper Saves", "Total passes", "Passes accurate", "Passes %"
        private Object value;  // Puede ser Integer, String (porcentaje) o null
    }
}
