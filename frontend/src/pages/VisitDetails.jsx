import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Calendar,
  Building,
  UserCheck,
  FileText,
  Pill,
  ArrowLeft,
  Edit,
  Trash2,
  Printer,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import api from '../api/client';
import Toast from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';

export default function VisitDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    if (location.state?.toastMessage) {
      setToast({ message: location.state.toastMessage, type: 'success' });
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    const fetchVisitDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/visits/${id}`);
        setVisit(res.data);
      } catch (err) {
        console.error('Error fetching visit details', err);
        setToast({ message: 'Failed to load medical visit details.', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchVisitDetails();
  }, [id]);

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await api.delete(`/visits/${id}`);
      navigate('/visits', { state: { toastMessage: 'Medical visit removed successfully.' } });
    } catch (err) {
      console.error('Error deleting visit', err);
      setToast({ message: 'Failed to delete visit. Please try again.', type: 'error' });
      setDeleteLoading(false);
      setDeleteModalOpen(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading visit details...
      </div>
    );
  }

  if (!visit) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <h3>Medical Visit Not Found</h3>
        <p style={{ color: 'var(--text-muted)', margin: '8px 0 20px' }}>
          The requested record may have been removed or does not exist.
        </p>
        <Link to="/visits" className="btn btn-primary">
          Back to Medical History
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Medical Visit"
        message="Are you sure you want to permanently delete this medical visit and its prescriptions? This action cannot be reversed."
        confirmText="Yes, Delete Record"
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />

      {/* Top Navigation & Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <Link to="/visits" className="btn btn-outline btn-sm">
          <ArrowLeft size={16} />
          <span>Back to Medical History</span>
        </Link>

        <div style={{ display: 'inline-flex', gap: '10px' }}>
          <button className="btn btn-outline btn-sm" onClick={handlePrint} title="Print Medical Record">
            <Printer size={16} />
            <span>Print Report</span>
          </button>
          <Link to={`/visits/edit/${visit.id}`} className="btn btn-outline btn-sm">
            <Edit size={16} />
            <span>Edit Visit</span>
          </Link>
          <button className="btn btn-danger-outline btn-sm" onClick={() => setDeleteModalOpen(true)}>
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Medical Record Summary Sheet */}
      <div className="card" style={{ padding: '32px', marginBottom: '32px' }}>
        {/* Record Header */}
        <div style={{
          borderBottom: '2px solid var(--border-color)',
          paddingBottom: '24px',
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '10px' }}>
              <Calendar size={14} /> {formatDate(visit.visitDate)}
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              {visit.diagnosis}
            </h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Record ID: #{visit.id} &bull; Recorded on {new Date(visit.createdAt || visit.visitDate).toLocaleDateString()}
            </p>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '14px 20px', minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Building size={16} color="var(--primary)" />
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Hospital / Clinic</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>{visit.hospitalName}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={16} color="var(--teal)" />
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Doctor</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>Dr. {visit.doctorName}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Symptoms and Clinical Findings */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0369a1', fontWeight: 700, fontSize: '0.95rem', marginBottom: '10px' }}>
              <FileText size={18} />
              <span>Reported Symptoms</span>
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
              {visit.symptoms}
            </p>
          </div>

          <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid #bbf7d0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#15803d', fontWeight: 700, fontSize: '0.95rem', marginBottom: '10px' }}>
              <CheckCircle2 size={18} />
              <span>Doctor's Diagnosis</span>
            </div>
            <p style={{ fontSize: '0.92rem', color: '#14532d', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap', fontWeight: 600 }}>
              {visit.diagnosis}
            </p>
          </div>
        </div>

        {/* Prescriptions Section */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Pill size={20} color="var(--teal)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
              Prescribed Medications ({visit.prescriptions?.length || 0})
            </h3>
          </div>

          {visit.prescriptions?.length === 0 ? (
            <div style={{ padding: '24px', background: '#f8fafc', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)' }}>
              No medications were prescribed for this visit.
            </div>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Medicine Name</th>
                    <th>Dosage</th>
                    <th>Duration</th>
                    <th>Instructions / Timing</th>
                  </tr>
                </thead>
                <tbody>
                  {visit.prescriptions.map((med, index) => (
                    <tr key={med.id || index}>
                      <td style={{ fontWeight: 700, color: 'var(--text-muted)', width: '40px' }}>{index + 1}</td>
                      <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Pill size={14} color="var(--teal)" />
                          <span>{med.medicineName}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-primary">{med.dosage || '-'}</span>
                      </td>
                      <td>
                        <span className="badge badge-neutral">{med.duration || '-'}</span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                        {med.instructions || 'As advised by doctor'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Additional Doctor Notes */}
        {visit.notes && (
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em', marginBottom: '8px' }}>
              Doctor's Additional Notes & Recommendations
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.6, background: '#fafafa', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', margin: 0, whiteSpace: 'pre-wrap' }}>
              {visit.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
