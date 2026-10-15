package com.medivault.service;

import com.medivault.dto.DashboardStatsResponse;
import com.medivault.dto.MedicalVisitResponse;
import com.medivault.entity.MedicalVisit;
import com.medivault.entity.User;
import com.medivault.repository.MedicalVisitRepository;
import com.medivault.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final MedicalVisitRepository medicalVisitRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final MedicalVisitService medicalVisitService;
    private final AuthService authService;

    public DashboardService(MedicalVisitRepository medicalVisitRepository,
                            PrescriptionRepository prescriptionRepository,
                            MedicalVisitService medicalVisitService,
                            AuthService authService) {
        this.medicalVisitRepository = medicalVisitRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.medicalVisitService = medicalVisitService;
        this.authService = authService;
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Long userId = currentUser.getId();

        long totalVisits = medicalVisitRepository.countByUserId(userId);
        long totalPrescriptions = prescriptionRepository.countByUserId(userId);
        long totalDoctors = medicalVisitRepository.countDistinctDoctorsByUserId(userId);
        long totalHospitals = medicalVisitRepository.countDistinctHospitalsByUserId(userId);

        List<MedicalVisit> recentVisitsList = medicalVisitRepository.findTop5ByUserIdOrderByVisitDateDesc(userId);
        List<MedicalVisitResponse> recentVisits = recentVisitsList.stream()
                .map(medicalVisitService::mapToResponse)
                .collect(Collectors.toList());

        return new DashboardStatsResponse(
                totalVisits,
                totalPrescriptions,
                totalDoctors,
                totalHospitals,
                recentVisits
        );
    }
}
