package com.medivault.dto;

import java.util.ArrayList;
import java.util.List;

public class DashboardStatsResponse {

    private long totalVisits;
    private long totalPrescriptions;
    private long totalDoctors;
    private long totalHospitals;
    private List<MedicalVisitResponse> recentVisits = new ArrayList<>();

    public DashboardStatsResponse() {
    }

    public DashboardStatsResponse(long totalVisits, long totalPrescriptions, long totalDoctors, long totalHospitals, List<MedicalVisitResponse> recentVisits) {
        this.totalVisits = totalVisits;
        this.totalPrescriptions = totalPrescriptions;
        this.totalDoctors = totalDoctors;
        this.totalHospitals = totalHospitals;
        this.recentVisits = recentVisits != null ? recentVisits : new ArrayList<>();
    }

    public long getTotalVisits() {
        return totalVisits;
    }

    public void setTotalVisits(long totalVisits) {
        this.totalVisits = totalVisits;
    }

    public long getTotalPrescriptions() {
        return totalPrescriptions;
    }

    public void setTotalPrescriptions(long totalPrescriptions) {
        this.totalPrescriptions = totalPrescriptions;
    }

    public long getTotalDoctors() {
        return totalDoctors;
    }

    public void setTotalDoctors(long totalDoctors) {
        this.totalDoctors = totalDoctors;
    }

    public long getTotalHospitals() {
        return totalHospitals;
    }

    public void setTotalHospitals(long totalHospitals) {
        this.totalHospitals = totalHospitals;
    }

    public List<MedicalVisitResponse> getRecentVisits() {
        return recentVisits;
    }

    public void setRecentVisits(List<MedicalVisitResponse> recentVisits) {
        this.recentVisits = recentVisits != null ? recentVisits : new ArrayList<>();
    }
}
