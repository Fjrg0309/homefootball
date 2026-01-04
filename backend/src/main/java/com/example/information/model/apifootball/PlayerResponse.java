package com.example.information.model.apifootball;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

/**
 * Respuesta de la API para jugadores
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class PlayerResponse {
    
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
    private List<PlayerData> response;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Paging {
        private int current;
        private int total;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class PlayerData {
        private Player player;
        private List<Statistics> statistics;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Player {
        private int id;
        private String name;
        private String firstname;
        private String lastname;
        private int age;
        private Birth birth;
        private String nationality;
        private String height;
        private String weight;
        private boolean injured;
        private String photo;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Birth {
        private String date;
        private String place;
        private String country;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Statistics {
        private StatTeam team;
        private StatLeague league;
        private Games games;
        private Goals goals;
        private Passes passes;
        private Cards cards;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class StatTeam {
        private int id;
        private String name;
        private String logo;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class StatLeague {
        private int id;
        private String name;
        private String country;
        private String logo;
        private String flag;
        private String season;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Games {
        private Integer appearances;
        private Integer lineups;
        private Integer minutes;
        private String position;
        private String rating;
        private boolean captain;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Goals {
        private Integer total;
        private Integer conceded;
        private Integer assists;
        private Integer saves;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Passes {
        private Integer total;
        private Integer key;
        private Integer accuracy;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Cards {
        private Integer yellow;
        private Integer yellowred;
        private Integer red;
    }
}
