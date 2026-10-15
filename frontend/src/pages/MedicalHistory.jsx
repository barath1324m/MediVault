import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  ArrowUpDown,
  Calendar,
  Building,
  UserCheck,
  Pill,
  Eye,
  Edit,
  Trash2,
  PlusCircle,
  X,
  FileSpreadsheet
} from 'lucide-react';
import api from '../api/client';
import Toast from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';

export default function MedicalHistory() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, visitId: null, visitDiagnosis: '' });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const location = useLocation();

  useEffect(() => {
    if (location.state?.toastMessage) {
      setToast({ message: location.state.toastMessage, type: 'success' });
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery.trim()) {
        params.append('query', searchQuery.trim());
      }
      params.append('sort', sortOrder);

      const res = await api.get(`/visits?${params.toString()}`);
      setVisits(res.data);
    } catch (err) {
      console.error('Error fetching visits', err);
      setToast({ message: 'Failed to load medical history records.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchVisits();
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, sortOrder]);

  const handleDeleteClick = (visit) => {
    setDeleteModal({
      isOpen: true,
      visitId: visit.id,
      visitDiagnosis: visit.diagnosis || 'this record',
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.visitId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/visits/${deleteModal.visitId}`);
      setToast({ message: 'Medical visit deleted successfully.', type: 'success' });
      setDeleteModal({ isOpen: false, visitId: null, visitDiagnosis: '' });
      fetchVisits();
    } catch (err) {
      console.error('Error deleting visit', err);
      setToast({ message: 'Failed to delete visit. Please try again.', type: 'error' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Medical Visit"
        message={`Are you sure you want to delete the visit for "${deleteModal.visitDiagnosis}"? This will also remove all associated prescriptions and cannot be undone.`}
        confirmText="Yes, Delete Visit"
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, visitId: null, visitDiagnosis: '' })}
      />

      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Medical History
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Complete archive of your hospital visits, illnesses, and prescriptions
          </p>
        </div>

        <Link to="/visits/new" className="btn btn-primary">
          <PlusCircle size={18} />
          <span>Add Medical Visit</span>
        </Link>
      </div>

      {/* Search and Filters Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {/* Search Input */}
          <div style={{ flex: 1, minWidth: '260px' }}>
            <div className="input-icon-wrapper">
              <Search size={18} className="input-icon" />
              <input
                type="text"
                className="form-control"
                placeholder="Search by symptoms, diagnosis, medicine, doctor, hospital..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Sort Selection */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowUpDown size={16} color="var(--text-muted)" />
            <select
              className="form-control"
              style={{ width: 'auto', minWidth: '170px' }}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="desc">Date (Newest First)</option>
              <option value="asc">Date (Oldest First)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Visits Table / List */}
      <div className="card">
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading medical history records...
          </div>
        ) : visits.length === 0 ? (
          searchQuery ? (
            <div style={{ textAlign: 'center', padding: '48px 24px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                No records match "{searchQuery}"
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Try searching with different keywords like illness name, medicine name, or doctor.
              </p>
              <button className="btn btn-outline btn-sm" onClick={() => setSearchQuery('')}>
                Clear Search Filter
              </button>
            </div>
          ) : (
            <EmptyState
              title="No medical visits recorded"
              description="Keep your health records organized and readily accessible when seeing doctors."
              actionText="Record Your First Visit"
              actionLink="/visits/new"
            />
          )
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '130px' }}>Date</th>
                  <th>Hospital & Doctor</th>
                  <th>Diagnosis & Symptoms</th>
                  <th>Prescriptions</th>
                  <th style={{ textAlign: 'right', minWidth: '180px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visits.map((visit) => (
                  <tr key={visit.id}>
                    <td>
                      <span className="badge badge-primary" style={{ padding: '6px 10px', whiteSpace: 'nowrap' }}>
                        <Calendar size={13} />
                        {formatDate(visit.visitDate)}
                      </span>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Building size={14} color="var(--primary)" />
                        {visit.hospitalName}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                        <UserCheck size={13} color="var(--teal)" />
                        Dr. {visit.doctorName}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700, color: '#0369a1' }}>
                        {visit.diagnosis}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px', maxWidth: '300px' }}>
                        <span style={{ fontWeight: 600 }}>Symptoms: </span>
                        {visit.symptoms}
                      </div>
                    </td>

                    <td>
                      {visit.prescriptions?.length > 0 ? (
                        <div>
                          <span className="badge badge-teal" style={{ marginBottom: '4px' }}>
                            <Pill size={12} />
                            {visit.prescriptions.length} {visit.prescriptions.length === 1 ? 'med' : 'meds'}
                          </span>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {visit.prescriptions.map(p => p.medicineName).join(', ')}
                          </div>
                        </div>
                      ) : (
                        <span className="badge badge-neutral">None</span>
                      )}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <Link
                          to={`/visits/${visit.id}`}
                          className="btn btn-outline btn-sm"
                          title="View Details"
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </Link>
                        <Link
                          to={`/visits/edit/${visit.id}`}
                          className="btn btn-outline btn-sm"
                          title="Edit Visit"
                        >
                          <Edit size={14} />
                          <span>Edit</span>
                        </Link>
                        <button
                          type="button"
                          className="btn btn-danger-outline btn-sm"
                          title="Delete Visit"
                          onClick={() => handleDeleteClick(visit)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
