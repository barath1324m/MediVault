import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, PlusCircle } from 'lucide-react';

export default function EmptyState({
  title = 'No medical records found',
  description = 'Start tracking your healthcare visits, diagnoses, and prescriptions.',
  actionText = 'Add Medical Visit',
  actionLink = '/visits/new',
}) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '48px 24px',
      background: '#ffffff',
      borderRadius: 'var(--radius-lg)',
      border: '1px dashed var(--border-color)',
      margin: '16px 0',
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'var(--primary-light)',
        color: 'var(--primary)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
      }}>
        <FileText size={32} />
      </div>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 24px' }}>
        {description}
      </p>
      {actionLink && (
        <Link to={actionLink} className="btn btn-primary">
          <PlusCircle size={18} />
          {actionText}
        </Link>
      )}
    </div>
  );
}
