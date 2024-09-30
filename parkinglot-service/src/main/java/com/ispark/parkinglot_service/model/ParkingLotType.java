package com.ispark.parkinglot_service.model;

public enum ParkingLotType {
    UNDERGROUND("Underground"),
    MULTI_STORY("Multi-story"),
    OPEN_AIR("Open-air"),
    VALET("Valet");

    private final String displayName;

    ParkingLotType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
