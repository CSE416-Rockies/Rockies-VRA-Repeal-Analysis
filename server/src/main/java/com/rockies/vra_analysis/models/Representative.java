package com.rockies.vra_analysis.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "representatives")
public class Representative {
    @Id
    private String id;

    private String state;
    private int districtNumber;
    private String name;
    private String party;
    private String racialEthnicGroup;
    private double voteMarginPercent;
    private String imageId;
    private String status;

    public Representative(String state, int districtNumber, String name, String party, String racialEthnicGroup, double voteMarginPercent, String imageId, String status) {
        this.state = state;
        this.districtNumber = districtNumber;
        this.name = name;
        this.party = party;
        this.racialEthnicGroup = racialEthnicGroup;
        this.voteMarginPercent = voteMarginPercent;
        this.imageId = imageId;
        this.status = status;
    }

    public String getState() {
        return state;
    }

    public int getDistrictNumber() {
        return districtNumber;
    }

    public String getName() {
        return name;
    }

    public String getParty() {
        return party;
    }

    public String getRacialEthnicGroup() {
        return racialEthnicGroup;
    }

    public double getVoteMarginPercent() {
        return voteMarginPercent;
    }

    public String getImageId() {
        return imageId;
    }

    public String getStatus() {
        return status;
    }
}
