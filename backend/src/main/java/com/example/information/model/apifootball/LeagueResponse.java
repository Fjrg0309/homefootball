package com.example.information.model.apifootball;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

/**
 * Respuesta de la API para ligas
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class LeagueResponse {
    
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
    private List<LeagueData> response;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Paging {
        private int current;
        private int total;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class LeagueData {
        private League league;
        private Country country;
        private List<Season> seasons;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class League {
        private int id;
        private String name;
        private String type;
        private String logo;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Country {
        private String name;
        private String code;
        private String flag;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Season {
        private int year;
        private String start;
        private String end;
        private boolean current;
        private Coverage coverage;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Coverage {
        private Fixtures fixtures;
        private boolean standings;
        private boolean players;
        @JsonProperty("top_scorers")
        private boolean topScorers;
        @JsonProperty("top_assists")
        private boolean topAssists;
        @JsonProperty("top_cards")
        private boolean topCards;
        private boolean injuries;
        private boolean predictions;
        private boolean odds;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Fixtures {
        private boolean events;
        private boolean lineups;
        @JsonProperty("statistics_fixtures")
        private boolean statisticsFixtures;
        @JsonProperty("statistics_players")
        private boolean statisticsPlayers;
    }
}
