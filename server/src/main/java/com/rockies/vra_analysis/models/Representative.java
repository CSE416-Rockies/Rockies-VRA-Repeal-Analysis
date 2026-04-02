package com.rockies.vra_analysis.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "representatives")
public class Representative {
    @Id
    private String id;

    private String state;

    @Field("district_number")
    private int districtNumber;

    private String name;
    private String party;

    @Field("racial_ethnic_group")
    private String racialEthnicGroup;

    @Field("vote_margin_percent")
    private double voteMarginPercent;

    @Field("image_id")
    private String imageId;

    private String status;

    public Representative() {}

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
    
    public String getId() { return id; }

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
