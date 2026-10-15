import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Building,
  UserCheck,
  FileText,
  Pill,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import api from '../api/client';
import Toast from '../components/Toast';

export default function VisitForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    visitDate: new Date().toISOString().split('T')[0],
    hospitalName: '',
    doctorName: '',
    symptoms: '',
    diagnosis: '',
    notes: '',
  });

  const [prescriptions, setPrescriptions] = useState([
    { medicineName: '', dosage: '', duration: '', instructions: '' }
  ]);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [toast, setToast] = useState({ message: '', type: 'error' });
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      const fetchVisit = async () => {
        try {
          const res = await api.get(`/visits/${id}`);
          const v = res.data;
          setFormData({
            visitDate: v.visitDate || '',
            hospitalName: v.hospitalName || '',
            doctorName: v.doctorName || '',
            symptoms: v.symptoms || '',
            diagnosis: v.diagnosis || '',
            notes: v.notes || '',
          });

          if (v.prescriptions && v.prescriptions.length > 0) {
            setPrescriptions(v.prescriptions.map(p => ({
              medicineName: p.medicineName || '',
              dosage: p.dosage || '',
              duration: p.duration || '',
              instructions: p.instructions || ''
            })));
          } else {
            setPrescriptions([{ medicineName: '', dosage: '', duration: '', instructions: '' }]);
          }
        } catch (err) {
          console.error('Error fetching visit for editing', err);
          setToast({ message: 'Failed to load visit details for editing.', type: 'error' });
        } finally {
          setInitialLoading(false);
        }
      };

      fetchVisit();
    }
  }, [id, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handlePrescriptionChange = (index, field, value) => {
    setPrescriptions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addPrescriptionRow = () => {
    setPrescriptions((prev) => [
      ...prev,
      { medicineName: '', dosage: '', duration: '', instructions: '' }
    ]);
  };

  const removePrescriptionRow = (index) => {
    if (prescriptions.length === 1) {
      // Clear instead of removing last row
      setPrescriptions([{ medicineName: '', dosage: '', duration: '', instructions: '' }]);
      return;
    }
    setPrescriptions((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.visitDate) errors.visitDate = 'Visit date is required';
    if (!formData.hospitalName.trim()) errors.hospitalName = 'Hospital name is required';
    if (!formData.doctorName.trim()) errors.doctorName = 'Doctor name is required';
    if (!formData.symptoms.trim()) errors.symptoms = 'Symptoms are required';
    if (!formData.diagnosis.trim()) errors.diagnosis = 'Diagnosis is required';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setToast({ message: 'Please fill in all required fields.', type: 'error' });
      return;
    }

    // Filter out completely blank prescription rows
    const cleanedPrescriptions = prescriptions
      .filter(p => p.medicineName.trim() !== '')
      .map(p => ({
        medicineName: p.medicineName.trim(),
        dosage: p.dosage.trim() || 'As directed',
        duration: p.duration.trim() || 'As advised',
        instructions: p.instructions.trim() || null
      }));

    const payload = {
      ...formData,
      prescriptions: cleanedPrescriptions,
    };

    setLoading(true);
    try {
      if (isEditMode) {
        await api.put(`/visits/${id}`, payload);
        navigate(`/visits/${id}`, { state: { toastMessage: 'Medical visit updated successfully!' } });
      } else {
        const res = await api.post('/visits', payload);
        navigate(`/visits/${res.data.id}`, { state: { toastMessage: 'Medical visit recorded successfully!' } });
      }
    } catch (err) {
      console.error('Error saving visit', err);
      const msg = err.response?.data?.message || 'Failed to save medical visit. Please try again.';
      setToast({ message: msg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading visit details...
      </div>
    );
  }

  return (
    <div>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'error' })}
      />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <Link to={isEditMode ? `/visits/${id}` : '/visits'} className="btn btn-outline btn-sm" style={{ marginBottom: '8px' }}>
            <ArrowLeft size={14} /> Back
          </Link>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            {isEditMode ? 'Edit Medical Visit' : 'Add Medical Visit'}
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            {isEditMode ? 'Update your previous hospital consultation details.' : 'Enter details of your doctor consultation, illness, and prescriptions.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Visit & Doctor Details Card */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <div className="card-title">
              <Calendar size={20} color="var(--primary)" />
              <span>Consultation & Facility Details</span>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">
                Visit Date <span className="required-star">*</span>
              </label>
              <input
                type="date"
                name="visitDate"
                className="form-control"
                value={formData.visitDate}
                onChange={handleInputChange}
                required
              />
              {fieldErrors.visitDate && <div className="form-error-msg">{fieldErrors.visitDate}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Hospital / Clinic Name <span className="required-star">*</span>
              </label>
              <div className="input-icon-wrapper">
                <Building size={17} className="input-icon" />
                <input
                  type="text"
                  name="hospitalName"
                  className="form-control"
                  placeholder="e.g. Apollo Hospital, City Health Clinic"
                  value={formData.hospitalName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {fieldErrors.hospitalName && <div className="form-error-msg">{fieldErrors.hospitalName}</div>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Doctor's Name <span className="required-star">*</span>
            </label>
            <div className="input-icon-wrapper">
              <UserCheck size={17} className="input-icon" />
              <input
                type="text"
                name="doctorName"
                className="form-control"
                placeholder="e.g. Dr. Sarah Jenkins, General Physician"
                value={formData.doctorName}
                onChange={handleInputChange}
                required
              />
            </div>
            {fieldErrors.doctorName && <div className="form-error-msg">{fieldErrors.doctorName}</div>}
          </div>
        </div>

        {/* Clinical Symptoms & Diagnosis Card */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <div className="card-title">
              <FileText size={20} color="var(--teal)" />
              <span>Symptoms & Diagnosis</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Symptoms Experienced <span className="required-star">*</span>
            </label>
            <textarea
              name="symptoms"
              className="form-control"
              placeholder="e.g. High fever for 3 days, dry cough, severe headache and fatigue..."
              value={formData.symptoms}
              onChange={handleInputChange}
              rows="3"
              required
            />
            {fieldErrors.symptoms && <div className="form-error-msg">{fieldErrors.symptoms}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">
              Doctor's Diagnosis <span className="required-star">*</span>
            </label>
            <textarea
              name="diagnosis"
              className="form-control"
              placeholder="e.g. Viral Upper Respiratory Tract Infection, Seasonal Influenza..."
              value={formData.diagnosis}
              onChange={handleInputChange}
              rows="3"
              required
            />
            {fieldErrors.diagnosis && <div className="form-error-msg">{fieldErrors.diagnosis}</div>}
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Additional Doctor Notes / Advice (Optional)</label>
            <textarea
              name="notes"
              className="form-control"
              placeholder="e.g. Rest for 5 days, drink plenty of fluids, follow-up in 1 week if fever persists..."
              value={formData.notes}
              onChange={handleInputChange}
              rows="2"
            />
          </div>
        </div>

        {/* Prescriptions Section */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <div className="card-title">
              <Pill size={20} color="var(--teal)" />
              <span>Prescribed Medicines</span>
            </div>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={addPrescriptionRow}
            >
              <Plus size={15} />
              <span>Add Another Medicine</span>
            </button>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            List all medications prescribed during this visit with their dosage, duration, and instructions.
          </p>

          <div className="prescriptions-box">
            {prescriptions.map((p, index) => (
              <div key={index} className="prescription-row-card">
                <div className="prescription-row-header">
                  <span className="prescription-index">
                    <Pill size={14} /> Medicine #{index + 1}
                  </span>
                  <button
                    type="button"
                    className="btn btn-danger-outline btn-sm"
                    onClick={() => removePrescriptionRow(index)}
                    title="Remove this medicine"
                  >
                    <Trash2 size={14} />
                    <span>Remove</span>
                  </button>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Medicine Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Paracetamol / Amoxicillin"
                      value={p.medicineName}
                      onChange={(e) => handlePrescriptionChange(index, 'medicineName', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Dosage</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 500mg, 1 tablet twice daily"
                      value={p.dosage}
                      onChange={(e) => handlePrescriptionChange(index, 'dosage', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-grid-2" style={{ marginBottom: 0 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Duration</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 5 days, 2 weeks, as needed"
                      value={p.duration}
                      onChange={(e) => handlePrescriptionChange(index, 'duration', e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Special Instructions</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Take after meals, with a glass of water"
                      value={p.instructions}
                      onChange={(e) => handlePrescriptionChange(index, 'instructions', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="btn btn-outline"
              style={{ width: '100%', borderStyle: 'dashed' }}
              onClick={addPrescriptionRow}
            >
              <Plus size={16} />
              <span>Add Another Medicine</span>
            </button>
          </div>
        </div>

        {/* Submit Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '40px' }}>
          <Link to={isEditMode ? `/visits/${id}` : '/visits'} className="btn btn-outline">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: '160px' }}>
            <Save size={18} />
            <span>{loading ? 'Saving...' : (isEditMode ? 'Update Visit' : 'Save Medical Visit')}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
