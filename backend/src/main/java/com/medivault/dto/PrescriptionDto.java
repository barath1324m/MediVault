package com.medivault.dto;

import jakarta.validation.constraints.NotBlank;

public class PrescriptionDto {

    private Long id;

    @NotBlank(message = "Medicine name is required")
    private String medicineName;

    @NotBlank(message = "Dosage is required (e.g., 500mg, 1 tablet)")
    private String dosage;

    @NotBlank(message = "Duration is required (e.g., 5 days, 2 weeks)")
    private String duration;

    private String instructions;

    public PrescriptionDto() {
    }

    public PrescriptionDto(Long id, String medicineName, String dosage, String duration, String instructions) {
        this.id = id;
        this.medicineName = medicineName;
        this.dosage = dosage;
        this.duration = duration;
        this.instructions = instructions;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMedicineName() {
        return medicineName;
    }

    public void setMedicineName(String medicineName) {
        this.medicineName = medicineName;
    }

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }
}
