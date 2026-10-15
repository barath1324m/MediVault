package com.medivault.service;

import com.medivault.dto.MedicalVisitRequest;
import com.medivault.dto.MedicalVisitResponse;
import com.medivault.dto.PrescriptionDto;
import com.medivault.entity.MedicalVisit;
import com.medivault.entity.Prescription;
import com.medivault.entity.User;
import com.medivault.exception.ResourceNotFoundException;
import com.medivault.repository.MedicalVisitRepository;
import com.medivault.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicalVisitService {

    private final MedicalVisitRepository medicalVisitRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final AuthService authService;

    public MedicalVisitService(MedicalVisitRepository medicalVisitRepository,
                               PrescriptionRepository prescriptionRepository,
                               AuthService authService) {
        this.medicalVisitRepository = medicalVisitRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.authService = authService;
    }

    @Transactional(readOnly = true)
    public List<MedicalVisitResponse> getAllVisits(String query, String sort) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        boolean ascending = "asc".equalsIgnoreCase(sort);

        List<MedicalVisit> visits;
        if (StringUtils.hasText(query)) {
            String trimmedQuery = query.trim();
            visits = ascending
                    ? medicalVisitRepository.searchVisitsAsc(currentUser.getId(), trimmedQuery)
                    : medicalVisitRepository.searchVisitsDesc(currentUser.getId(), trimmedQuery);
        } else {
            visits = ascending
                    ? medicalVisitRepository.findByUserIdOrderByVisitDateAsc(currentUser.getId())
                    : medicalVisitRepository.findByUserIdOrderByVisitDateDesc(currentUser.getId());
        }

        return visits.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MedicalVisitResponse getVisitById(Long id) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        MedicalVisit visit = medicalVisitRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Medical visit not found with id: " + id));

        return mapToResponse(visit);
    }

    @Transactional
    public MedicalVisitResponse createVisit(MedicalVisitRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();

        MedicalVisit visit = new MedicalVisit();
        visit.setUser(currentUser);
        visit.setVisitDate(request.getVisitDate());
        visit.setSymptoms(request.getSymptoms().trim());
        visit.setDiagnosis(request.getDiagnosis().trim());
        visit.setHospitalName(request.getHospitalName().trim());
        visit.setDoctorName(request.getDoctorName().trim());
        visit.setNotes(request.getNotes() != null ? request.getNotes().trim() : null);

        if (request.getPrescriptions() != null && !request.getPrescriptions().isEmpty()) {
            for (PrescriptionDto pDto : request.getPrescriptions()) {
                if (StringUtils.hasText(pDto.getMedicineName())) {
                    Prescription prescription = new Prescription();
                    prescription.setMedicineName(pDto.getMedicineName().trim());
                    prescription.setDosage(pDto.getDosage() != null ? pDto.getDosage().trim() : "");
                    prescription.setDuration(pDto.getDuration() != null ? pDto.getDuration().trim() : "");
                    prescription.setInstructions(pDto.getInstructions() != null ? pDto.getInstructions().trim() : null);
                    visit.addPrescription(prescription);
                }
            }
        }

        MedicalVisit savedVisit = medicalVisitRepository.save(visit);
        return mapToResponse(savedVisit);
    }

    @Transactional
    public MedicalVisitResponse updateVisit(Long id, MedicalVisitRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();

        MedicalVisit visit = medicalVisitRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Medical visit not found with id: " + id));

        visit.setVisitDate(request.getVisitDate());
        visit.setSymptoms(request.getSymptoms().trim());
        visit.setDiagnosis(request.getDiagnosis().trim());
        visit.setHospitalName(request.getHospitalName().trim());
        visit.setDoctorName(request.getDoctorName().trim());
        visit.setNotes(request.getNotes() != null ? request.getNotes().trim() : null);

        // Clear existing prescriptions and replace with new list
        visit.getPrescriptions().clear();

        if (request.getPrescriptions() != null && !request.getPrescriptions().isEmpty()) {
            for (PrescriptionDto pDto : request.getPrescriptions()) {
                if (StringUtils.hasText(pDto.getMedicineName())) {
                    Prescription prescription = new Prescription();
                    prescription.setMedicineName(pDto.getMedicineName().trim());
                    prescription.setDosage(pDto.getDosage() != null ? pDto.getDosage().trim() : "");
                    prescription.setDuration(pDto.getDuration() != null ? pDto.getDuration().trim() : "");
                    prescription.setInstructions(pDto.getInstructions() != null ? pDto.getInstructions().trim() : null);
                    visit.addPrescription(prescription);
                }
            }
        }

        MedicalVisit updatedVisit = medicalVisitRepository.save(visit);
        return mapToResponse(updatedVisit);
    }

    @Transactional
    public void deleteVisit(Long id) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        MedicalVisit visit = medicalVisitRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Medical visit not found with id: " + id));

        medicalVisitRepository.delete(visit);
    }

    public MedicalVisitResponse mapToResponse(MedicalVisit visit) {
        MedicalVisitResponse response = new MedicalVisitResponse();
        response.setId(visit.getId());
        response.setUserId(visit.getUser().getId());
        response.setVisitDate(visit.getVisitDate());
        response.setSymptoms(visit.getSymptoms());
        response.setDiagnosis(visit.getDiagnosis());
        response.setHospitalName(visit.getHospitalName());
        response.setDoctorName(visit.getDoctorName());
        response.setNotes(visit.getNotes());
        response.setCreatedAt(visit.getCreatedAt());

        List<PrescriptionDto> prescriptionDtos = new ArrayList<>();
        if (visit.getPrescriptions() != null) {
            for (Prescription p : visit.getPrescriptions()) {
                prescriptionDtos.add(new PrescriptionDto(
                        p.getId(),
                        p.getMedicineName(),
                        p.getDosage(),
                        p.getDuration(),
                        p.getInstructions()
                ));
            }
        }
        response.setPrescriptions(prescriptionDtos);
        return response;
    }
}
