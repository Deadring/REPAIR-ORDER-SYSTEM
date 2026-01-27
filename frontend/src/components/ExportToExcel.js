import React, { useState, useEffect, useCallback } from 'react';
import { exportToExcel, getAllRepairOrders, getCurrentUser } from '../services/api';
import './ExportToExcel.css';

const ExportToExcel = ({ isOpen, onClose, onExportStart, onExportEnd }) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [store, setStore] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stores, setStores] = useState([]);
  const [loadingStores, setLoadingStores] = useState(false);
  const user = getCurrentUser();
  const isAdmin = user?.role === 'admin';

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  // Load unique stores on component mount
  const loadStores = useCallback(async () => {
    try {
      setLoadingStores(true);
      const orders = await getAllRepairOrders();
      const uniqueStores = [...new Set(orders.map(order => order.store))].sort();
      setStores(uniqueStores);
      
      // If non-admin, set default store to first available
      if (!isAdmin && uniqueStores.length > 0 && store === 'all') {
        setStore(uniqueStores[0]);
      }
    } catch (err) {
      console.error('Error loading stores:', err);
    } finally {
      setLoadingStores(false);
    }
  }, [isAdmin, store]);

  useEffect(() => {
    if (isOpen && stores.length === 0) {
      loadStores();
    }
  }, [isOpen, stores.length, loadStores]);

  const handleExport = async () => {
    setError('');
    setLoading(true);
    
    try {
      if (onExportStart) onExportStart();
      
      await exportToExcel(year, month, store);
      
      // Reset form after successful export
      setMonth(new Date().getMonth() + 1);
      setYear(new Date().getFullYear());
      setStore('all');
      onClose();
      
    } catch (err) {
      setError('Failed to export Excel. Please try again.');
      console.error('Export error:', err);
    } finally {
      setLoading(false);
      if (onExportEnd) onExportEnd();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="export-overlay" onClick={onClose}>
      <div className="export-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="export-header">
          <h3>📊 Export to Excel</h3>
          <button className="btn-close" onClick={onClose}>X</button>
        </div>

        <div className="export-body">
          <div className="form-group">
            <label htmlFor="year">Tahun:</label>
            <select
              id="year"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              disabled={loading}
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="month">Bulan:</label>
            <select
              id="month"
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              disabled={loading}
            >
              {months.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="store">
              Store:
              {!isAdmin && <span className="admin-only-badge">Admin Only</span>}
            </label>
            <select
              id="store"
              value={store}
              onChange={(e) => setStore(e.target.value)}
              disabled={loading || loadingStores}
            >
              {isAdmin && <option value="all">All Stores</option>}
              {stores.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {!isAdmin && <small className="info-text">📌 Hanya Admin yang dapat memilih semua store</small>}
            {loadingStores && <small className="loading-text">Loading stores...</small>}
          </div>

          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="export-footer">
          <button 
            className="btn-cancel" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className="btn-export" 
            onClick={handleExport}
            disabled={loading}
          >
            {loading ? 'Exporting...' : 'Export Excel'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportToExcel;
