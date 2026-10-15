package com.medivault.controller;

import com.medivault.dto.MedicalVisitRequest;
import com.medivault.dto.MedicalVisitResponse;
import com.medivault.service.MedicalVisitService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/visits")
public class MedicalVisitController {

    private final MedicalVisitService medicalVisitService;

    public MedicalVisitController(MedicalVisitService medicalVisitService) {
        this.medicalVisitService = medicalVisitService;
    }

    @GetMapping
    public ResponseEntity<List<MedicalVisitResponse>> getAllVisits(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "desc") String sort) {
        List<MedicalVisitResponse> visits = medicalVisitService.getAllVisits(query, sort);
        return ResponseEntity.ok(visits);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalVisitResponse> getVisitById(@PathVariable Long id) {
        MedicalVisitResponse visit = medicalVisitService.getVisitById(id);
        return ResponseEntity.ok(visit);
    }

    @PostMapping
    public ResponseEntity<MedicalVisitResponse> createVisit(@Valid @RequestBody MedicalVisitRequest request) {
        MedicalVisitResponse created = medicalVisitService.createVisit(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicalVisitResponse> updateVisit(
            @PathVariable Long id,
            @Valid @RequestBody MedicalVisitRequest request) {
        MedicalVisitResponse updated = medicalVisitService.updateVisit(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteVisit(@PathVariable Long id) {
        medicalVisitService.deleteVisit(id);
        return ResponseEntity.ok(Map.of("message", "Medical visit deleted successfully"));
    }
}
