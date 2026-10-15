import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div className="toast-container">
      <div className={`toast ${isSuccess ? 'toast-success' : 'toast-error'}`}>
        {isSuccess ? (
          <CheckCircle2 size={20} className="text-success" color="#10b981" />
        ) : (
          <AlertCircle size={20} className="text-danger" color="#ef4444" />
        )}
        <div style={{ flex: 1, fontSize: '0.9rem', fontWeight: 500 }}>
          {message}
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
