package com.medivault.repository;

import com.medivault.entity.MedicalVisit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicalVisitRepository extends JpaRepository<MedicalVisit, Long> {

    List<MedicalVisit> findByUserIdOrderByVisitDateDesc(Long userId);

    List<MedicalVisit> findByUserIdOrderByVisitDateAsc(Long userId);

    Optional<MedicalVisit> findByIdAndUserId(Long id, Long userId);

    long countByUserId(Long userId);

    List<MedicalVisit> findTop5ByUserIdOrderByVisitDateDesc(Long userId);

    @Query("SELECT DISTINCT v FROM MedicalVisit v " +
           "LEFT JOIN v.prescriptions p " +
           "WHERE v.user.id = :userId AND (" +
           "LOWER(v.symptoms) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(v.diagnosis) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(v.hospitalName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(v.doctorName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.medicineName) LIKE LOWER(CONCAT('%', :query, '%'))" +
           ") ORDER BY v.visitDate DESC")
    List<MedicalVisit> searchVisitsDesc(@Param("userId") Long userId, @Param("query") String query);

    @Query("SELECT DISTINCT v FROM MedicalVisit v " +
           "LEFT JOIN v.prescriptions p " +
           "WHERE v.user.id = :userId AND (" +
           "LOWER(v.symptoms) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(v.diagnosis) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(v.hospitalName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(v.doctorName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.medicineName) LIKE LOWER(CONCAT('%', :query, '%'))" +
           ") ORDER BY v.visitDate ASC")
    List<MedicalVisit> searchVisitsAsc(@Param("userId") Long userId, @Param("query") String query);

    @Query("SELECT COUNT(DISTINCT v.doctorName) FROM MedicalVisit v WHERE v.user.id = :userId")
    long countDistinctDoctorsByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(DISTINCT v.hospitalName) FROM MedicalVisit v WHERE v.user.id = :userId")
    long countDistinctHospitalsByUserId(@Param("userId") Long userId);
}
