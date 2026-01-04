package com.example.information.model.apifootball;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

/**
 * Respuesta de la API para clasificaciones (standings)
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class StandingsResponse {
    
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
    private List<StandingsData> response;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Paging {
        private int current;
        private int total;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class StandingsData {
        private League league;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class League {
        private int id;
        private String name;
        private String country;
        private String logo;
        private String flag;
        private int season;
        private List<List<Standing>> standings;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Standing {
        private int rank;
        private Team team;
        private int points;
        private int goalsDiff;
        private String group;
        private String form;
        private String status;
        private String description;
        private MatchStats all;
        private MatchStats home;
        private MatchStats away;
        private String update;
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
    public static class MatchStats {
        private int played;
        private int win;
        private int draw;
        private int lose;
        private GoalsStats goals;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class GoalsStats {
        @JsonProperty("for")
        private int goalsFor;
        private int against;
    }
}
