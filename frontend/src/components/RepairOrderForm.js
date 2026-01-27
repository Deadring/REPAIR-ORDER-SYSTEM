import React, { useState, useEffect } from 'react';
import './RepairOrderForm.css';

const RepairOrderForm = ({ order, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    arrival_number: '',
    arrival_date: '',
    store: '',
    division: '',
    device_name: '',
    number_inventory: '',
    serial_number: '',
    issue: '',
    repair_note: '',
    departure_date: '',
    departure_number: '',
    repair_order: '',
    ship_address: ''
  });

  useEffect(() => {
    if (order) {
      setFormData({
        arrival_number: order.arrival_number || '',
        arrival_date: order.arrival_date ? order.arrival_date.split('T')[0] : '',
        store: order.store || '',
        division: order.division || '',
        device_name: order.device_name || '',
        number_inventory: order.number_inventory || '',
        serial_number: order.serial_number || '',
        issue: order.issue || '',
        repair_note: order.repair_note || '',
        departure_date: order.departure_date ? order.departure_date.split('T')[0] : '',
        departure_number: order.departure_number || '',
        repair_order: order.repair_order || '',
        ship_address: order.ship_address || ''
      });
    }
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        <div className="form-header">
          <h2>{order ? 'Edit Repair Order' : 'Tambah Repair Order Baru'}</h2>
          <button className="btn-close" onClick={onCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="repair-order-form">
          <div className="form-section">
            <h3>Informasi Kedatangan</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Nomor SJ *</label>
                <input
                  type="text"
                  name="arrival_number"
                  value={formData.arrival_number}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Tanggal *</label>
                <input
                  type="date"
                  name="arrival_date"
                  value={formData.arrival_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Toko *</label>
                <input
                  type="text"
                  name="store"
                  value={formData.store}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Divisi *</label>
                <input
                  type="text"
                  name="division"
                  value={formData.division}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Informasi Perangkat</h3>
            <div className="form-group">
              <label>Nama Perangkat *</label>
              <input
                type="text"
                name="device_name"
                value={formData.device_name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Nomor Inventaris</label>
              <input
                type="text"
                name="number_inventory"
                value={formData.number_inventory}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Nomor Seri</label>
              <input
                type="text"
                name="serial_number"
                value={formData.serial_number}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Kasus & Detail Perbaikan</h3>
            <div className="form-group">
              <label>Kasus Permasalahan</label>
              <textarea
                name="issue"
                value={formData.issue}
                onChange={handleChange}
                rows="3"
              />
              
            </div>
          </div>

          {order && (
            <div className="form-section">
              <h3>Informasi Keberangkatan (Barang Sudah Diperbaiki)</h3>
              <div className="form-rowSpan">
                <div className="form-group">
                  <label>Catatan Perbaikan</label>
                  <input
                    type="text"
                    name="repair_note"
                    value={formData.repair_note}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Tanggal</label>
                  <input
                    type="date"
                    name="departure_date"
                    value={formData.departure_date}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>Nomor SJ</label>
                  <input
                    type="text"
                    name="departure_number"
                    value={formData.departure_number}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Repair Order</label>
                  <input
                    type="text"
                    name="repair_order"
                    value={formData.repair_order}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>Pengirim</label>
                  <input
                    type="text"
                    name="ship_address"
                    value={formData.ship_address}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn btn-cancel" onClick={onCancel}>
              Batal
            </button>
            <button type="submit" className="btn btn-submit">
              {order ? 'Update' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RepairOrderForm;
