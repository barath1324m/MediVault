package com.medivault.repository;

import com.medivault.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    List<Prescription> findByMedicalVisitId(Long medicalVisitId);

    @Query("SELECT COUNT(p) FROM Prescription p WHERE p.medicalVisit.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);
}
