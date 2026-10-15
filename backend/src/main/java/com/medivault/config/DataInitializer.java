package com.medivault.config;

import com.medivault.entity.MedicalVisit;
import com.medivault.entity.Prescription;
import com.medivault.entity.User;
import com.medivault.repository.MedicalVisitRepository;
import com.medivault.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final MedicalVisitRepository medicalVisitRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           MedicalVisitRepository medicalVisitRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.medicalVisitRepository = medicalVisitRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            // Seed Demo User
            User demoUser = new User();
            demoUser.setName("Alex Morgan");
            demoUser.setEmail("demo.patient@medivault.com");
            demoUser.setPasswordHash(passwordEncoder.encode("Password123"));
            demoUser = userRepository.save(demoUser);

            // Visit 1: Cardiology consultation
            MedicalVisit visit1 = new MedicalVisit();
            visit1.setUser(demoUser);
            visit1.setVisitDate(LocalDate.now().minusDays(45));
            visit1.setHospitalName("St. Jude Medical Center");
            visit1.setDoctorName("Dr. Elizabeth Chen");
            visit1.setSymptoms("Recurrent chest tightness after brisk walking, occasional shortness of breath, resting blood pressure 142/92 mmHg.");
            visit1.setDiagnosis("Stage 1 Essential Hypertension & Mild Exertional Dyspnea");
            visit1.setNotes("Advised to adopt a low-sodium DASH diet and maintain a daily morning blood pressure log. Routine 30 min cardiovascular walking. Follow-up review in 6 weeks.");

            Prescription p1_1 = new Prescription("Amlodipine Besylate", "5mg once daily", "30 days", "Take in the morning with water");
            Prescription p1_2 = new Prescription("Metoprolol Succinate", "25mg once daily", "30 days", "Take with or immediately after morning breakfast");
            visit1.addPrescription(p1_1);
            visit1.addPrescription(p1_2);
            medicalVisitRepository.save(visit1);

            // Visit 2: Pulmonology consultation
            MedicalVisit visit2 = new MedicalVisit();
            visit2.setUser(demoUser);
            visit2.setVisitDate(LocalDate.now().minusDays(20));
            visit2.setHospitalName("Metro Health General Hospital");
            visit2.setDoctorName("Dr. Marcus Vance");
            visit2.setSymptoms("Persistent dry hacking cough lasting 2 weeks post viral illness, mild chest soreness, nocturnal wheezing.");
            visit2.setDiagnosis("Acute Post-Infectious Bronchitis");
            visit2.setNotes("Chest X-ray shows clear lung fields without infiltrate. Advised steam inhalation twice daily and room humidifier during sleep.");

            Prescription p2_1 = new Prescription("Albuterol HFA Inhaler", "90mcg (2 puffs)", "As needed (up to 4 times daily)", "Rinse mouth after inhalation");
            Prescription p2_2 = new Prescription("Benzonatate", "100mg capsule", "7 days", "Swallow whole, 3 times daily as needed for dry cough");
            Prescription p2_3 = new Prescription("Azithromycin", "250mg oral tablet", "5 days", "Take 500mg on day 1, then 250mg once daily for days 2-5");
            visit2.addPrescription(p2_1);
            visit2.addPrescription(p2_2);
            visit2.addPrescription(p2_3);
            medicalVisitRepository.save(visit2);

            // Visit 3: Gastroenterology consultation
            MedicalVisit visit3 = new MedicalVisit();
            visit3.setUser(demoUser);
            visit3.setVisitDate(LocalDate.now().minusDays(4));
            visit3.setHospitalName("City Center Specialty Clinic");
            visit3.setDoctorName("Dr. Priya Sharma");
            visit3.setSymptoms("Burning retrosternal discomfort after meals, acid regurgitation at bedtime, intermittent bloating.");
            visit3.setDiagnosis("Gastroesophageal Reflux Disease (GERD) & Mild Gastritis");
            visit3.setNotes("Avoid eating 3 hours prior to sleep. Reduce intake of carbonated beverages, spicy cuisine, and excessive coffee.");

            Prescription p3_1 = new Prescription("Pantoprazole Sodium", "40mg delayed-release", "4 weeks", "Take 30 minutes before breakfast on an empty stomach");
            Prescription p3_2 = new Prescription("Famotidine", "20mg tablet", "14 days", "Take 1 tablet at bedtime if breakthrough nocturnal reflux occurs");
            visit3.addPrescription(p3_1);
            visit3.addPrescription(p3_2);
            medicalVisitRepository.save(visit3);
        }
    }
}
