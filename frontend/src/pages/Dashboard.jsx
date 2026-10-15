import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Pill,
  UserCheck,
  Building,
  PlusCircle,
  Eye,
  ArrowRight,
  Clock,
  MapPin,
  Stethoscope,
  Activity
} from 'lucide-react';
import api from '../api/client';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalVisits: 0,
    totalPrescriptions: 0,
    totalDoctors: 0,
    totalHospitals: 0,
    recentVisits: [],
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'error' });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching dashboard stats', err);
      setToast({ message: 'Failed to load dashboard data. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
        onClose={() => setToast({ message: '', type: 'error' })}
      />

      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px 32px',
        color: '#ffffff',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: '0 8px 20px rgba(2, 132, 199, 0.25)',
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
            <Activity size={14} /> Medical Record Overview
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            Health History Dashboard
          </h1>
          <p style={{ margin: '6px 0 0', opacity: 0.9, fontSize: '0.95rem' }}>
            Keep track of doctor consultations, diagnoses, and your prescriptions in one secure place.
          </p>
        </div>

        <Link
          to="/visits/new"
          className="btn"
          style={{ background: '#ffffff', color: '#0369a1', fontWeight: 700, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        >
          <PlusCircle size={18} />
          Record New Visit
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          label="Total Hospital Visits"
          value={stats.totalVisits}
          icon={Calendar}
          theme="stat-blue"
        />
        <StatCard
          label="Prescribed Medicines"
          value={stats.totalPrescriptions}
          icon={Pill}
          theme="stat-teal"
        />
        <StatCard
          label="Doctors Consulted"
          value={stats.totalDoctors}
          icon={UserCheck}
          theme="stat-green"
        />
        <StatCard
          label="Hospitals Visited"
          value={stats.totalHospitals}
          icon={Building}
          theme="stat-amber"
        />
      </div>

      {/* Recent Visits Section */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Clock size={20} color="var(--primary)" />
            <span>Recent Medical Visits</span>
          </div>

          {stats.recentVisits.length > 0 && (
            <Link to="/visits" className="btn btn-outline btn-sm">
              <span>View All History</span>
              <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading medical history...
          </div>
        ) : stats.recentVisits.length === 0 ? (
          <EmptyState
            title="No medical visits recorded yet"
            description="Whenever you visit a doctor or hospital, record your symptoms, diagnosis, and prescribed medicines here."
            actionText="Add Your First Visit"
            actionLink="/visits/new"
          />
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Visit Date</th>
                  <th>Hospital & Doctor</th>
                  <th>Diagnosis & Symptoms</th>
                  <th>Prescriptions</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentVisits.map((visit) => (
                  <tr key={visit.id}>
                    <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="badge badge-primary" style={{ padding: '6px 10px' }}>
                          <Calendar size={13} />
                          {formatDate(visit.visitDate)}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Building size={14} color="var(--text-muted)" />
                        {visit.hospitalName}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                        <Stethoscope size={13} />
                        Dr. {visit.doctorName}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700, color: '#0369a1' }}>
                        {visit.diagnosis}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }} title={visit.symptoms}>
                        Symptoms: {visit.symptoms}
                      </div>
                    </td>

                    <td>
                      {visit.prescriptions?.length > 0 ? (
                        <span className="badge badge-teal">
                          <Pill size={12} />
                          {visit.prescriptions.length} {visit.prescriptions.length === 1 ? 'medicine' : 'medicines'}
                        </span>
                      ) : (
                        <span className="badge badge-neutral">No meds</span>
                      )}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <Link
                        to={`/visits/${visit.id}`}
                        className="btn btn-outline btn-sm"
                        title="View Complete Details"
                      >
                        <Eye size={14} />
                        <span>View</span>
                      </Link>
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
