package com.example.information.model.apifootball;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

/**
 * Respuesta de la API para la plantilla/squad de un equipo
 * Este endpoint devuelve SOLO los jugadores del primer equipo, no del filial
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SquadResponse {
    
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
    private List<TeamSquad> response;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Paging {
        private int current;
        private int total;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TeamSquad {
        private Team team;
        private List<SquadPlayer> players;
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
    public static class SquadPlayer {
        private int id;
        private String name;
        private int age;
        private Integer number;
        private String position;
        private String photo;
    }
}
