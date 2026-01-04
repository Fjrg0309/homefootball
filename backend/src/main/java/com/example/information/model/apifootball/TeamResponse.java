package com.example.information.model.apifootball;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

/**
 * Respuesta de la API para equipos
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TeamResponse {
    
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
    private List<TeamData> response;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Paging {
        private int current;
        private int total;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TeamData {
        private Team team;
        private Venue venue;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Team {
        private int id;
        private String name;
        private String code;
        private String country;
        private int founded;
        private boolean national;
        private String logo;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Venue {
        private int id;
        private String name;
        private String address;
        private String city;
        private int capacity;
        private String surface;
        private String image;
    }
}
