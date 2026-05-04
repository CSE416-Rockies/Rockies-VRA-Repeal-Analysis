package com.rockies.vra_analysis.models;

import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.rockies.vra_analysis.enums.Party;
import com.rockies.vra_analysis.enums.Race;
import com.rockies.vra_analysis.enums.State;

import java.util.Map;

@Document("state-detail")
public class StateDetail extends StateDocument{
   
    private RacialPopulation racialPopulation;
    private VoterDistribution voterDistribution;

    public StateDetail(){}
    public StateDetail(State state, RacialPopulation racialPopulation, VoterDistribution voterDistribution){
        super(state);
        this.racialPopulation = racialPopulation;
        this.voterDistribution = voterDistribution;
    }

    public RacialPopulation getRacialPopulation() { return this.racialPopulation; }
    public VoterDistribution getVoterDistribution() { return this.voterDistribution; }

    public static class VoterDistribution{
        private String partyControl;
        private Map<Party, Double> distributions;

        public VoterDistribution() {}

        @JsonCreator
        public VoterDistribution(
            @JsonProperty("partyControl") String partyControl,
            @JsonProperty("democratPercent") double democrat,
            @JsonProperty("republicanPercent") double republican,
            @JsonProperty("otherPercent") double other
        ) {
            this.partyControl = partyControl;
            this.distributions = Map.of(
                Party.DEMOCRAT, democrat,
                Party.REPUBLICAN, republican,
                Party.OTHER, other
            );
        }

        public String getPartyControl() { return partyControl; }
        public Map<Party, Double> getDistributions() { return distributions; }
    }

   public static class RacialPopulation {
        private int total;
        private Map<Race, Integer> populations;

        public RacialPopulation() {}

        @JsonCreator
        public RacialPopulation(
            @JsonProperty("totalPopulation") int total,
            @JsonProperty("whitePopulation") int white,
            @JsonProperty("blackPopulation") int black,
            @JsonProperty("latinoPopulation") int latino,
            @JsonProperty("otherPopulation") int other
        ) {
            this.total = total;
            this.populations = Map.of(
                Race.WHITE, white,
                Race.BLACK, black,
                Race.LATINO, latino,
                Race.OTHER, other
            );
        }
        
        public int getTotal() { return total; }
        public Map<Race, Integer> getPopulations() { return populations; }
    }

        
}
