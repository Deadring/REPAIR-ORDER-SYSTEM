import React, { useState, useMemo } from 'react';
import './RepairOrderTable.css';
import { getCurrentUser } from '../services/api';
import ExportToExcel from './ExportToExcel';

const RepairOrderTable = ({ orders = [], onEdit }) => {
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const user = getCurrentUser();

  const canEdit = user?.role === 'admin';

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  // 🔍 FILTER
  const filteredOrders = useMemo(() => {
    if (!search) return orders;

    return orders.filter((order) =>
      [
        order.arrival_number,
        order.device_name,
        order.store,
        order.division,
        order.number_inventory,
        order.serial_number,
      ]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [orders, search]);

  return (
    <div className="table-container">
      {/* PRINT HEADER */}
      <div className="print-header">
        <h1>REPAIR ORDER SYSTEM</h1>
        <p>Sistem Manajemen Perbaikan Perangkat</p>
        <p style={{fontSize: '12px', color: '#666'}}>Tanggal Cetak: {new Date().toLocaleDateString('id-ID')}</p>
      </div>

      {/* FILTER */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Cari SJ / Device / Store / Division / Inventory / Serial..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="btn-preview"
          onClick={() => window.print()}
          title="Preview untuk cetak"
        >
          🔍 Preview Cetak
        </button>
        <button 
          className="btn-export-monthly"
          onClick={() => setShowExportDialog(true)}
          title="Export per bulan ke Excel"
        >
          📥 Export Excel
        </button>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table className="repair-order-table">
          <thead>
            <tr>
              <th rowSpan="2">No</th>
              <th colSpan="3">Kedatangan</th>
              <th rowSpan="2">Nama Perangkat</th>
              <th rowSpan="2">Nomor Inventaris</th>
              <th rowSpan="2">Nomor Seri</th>
              <th rowSpan="2">Kasus Permasalahan</th>
              <th rowSpan="2">Catatan Perbaikan</th>
              <th colSpan="2">Keberangkatan</th>
              <th rowSpan="2">RO</th>
              <th rowSpan="2">Pengirim</th>
              <th rowSpan="2" className="print-hide">Actions</th>
            </tr>
            <tr>
              <th>Nomor SJ</th>
              <th>Tanggal</th>
              <th>Store / Division</th>
              <th>Tanggal Kirim</th>
              <th>Nomor SJ</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="14" className="no-data">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              filteredOrders.map((order, index) => (
                <tr key={order.id}>
                  <td className="text-center">{index + 1}</td>
                  <td>{order.arrival_number}</td>
                  <td>{formatDate(order.arrival_date)}</td>
                  <td>{order.store} / {order.division}</td>
                  <td>{order.device_name}</td>
                  <td>{order.number_inventory || '-'}</td>
                  <td>{order.serial_number || '-'}</td>
                  <td>{order.issue || '-'}</td>
                  <td>{order.repair_note || '-'}</td>
                  <td>{formatDate(order.departure_date)}</td>
                  <td>{order.departure_number || '-'}</td>
                  <td>{order.repair_order ? 'Ya' : 'Tidak'}</td>
                  <td>{order.ship_address || '-'}</td>
                  <td className="print-hide">
                    <div className="action-buttons">
                      <button
                        className="btn-view"
                        onClick={() => setSelectedOrder(order)}
                      >
                        👁️
                      </button>
                      <button
                        className="btn-edit"
                        onClick={() => onEdit(order)}
                        disabled={!canEdit}
                      >
                        ✏️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL DETAIL */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detail Repair Order</h3>
              <button onClick={() => setSelectedOrder(null)}>✕</button>
            </div>

            <div className="modal-body">
              <p><b>Kedatangan Nomor SJ:</b> {selectedOrder.arrival_number}</p>
              <p><b>Tanggal Kedatangan:</b> {formatDate(selectedOrder.arrival_date)}</p>
              <p><b>Toko / Divisi:</b> {selectedOrder.store} / {selectedOrder.division}</p>
              <hr />
              <p><b>Perangkat:</b> {selectedOrder.device_name}</p>
              <p><b>Nomor Inventaris:</b> {selectedOrder.number_inventory || '-'}</p>
              <p><b>Nomor Seri:</b> {selectedOrder.serial_number || '-'}</p>
              <p><b>Kasus Permasalahan:</b> {selectedOrder.issue || '-'}</p>
              <p><b>Catatan Perbaikan:</b> {selectedOrder.repair_note || '-'}</p>
              <hr />
              <p><b>Tanggal Kirim:</b> {formatDate(selectedOrder.departure_date)}</p>
              <p><b>Nomor SJ Kirim:</b> {selectedOrder.departure_number || '-'}</p>
              <p><b>RO:</b> {selectedOrder.repair_order ? 'Ya' : 'Tidak'}</p>
              <p><b>Pengirim:</b> {selectedOrder.ship_address || '-'}</p>
            </div>
          </div>
        </div>
      )}

      {/* EXPORT DIALOG */}
      <ExportToExcel 
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
      />
    </div>
  );
};

export default RepairOrderTable;
