import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Auth from './components/Auth';
import RepairOrderTable from './components/RepairOrderTable';
import RepairOrderForm from './components/RepairOrderForm';
import { getAllRepairOrders, createRepairOrder, updateRepairOrder, deleteRepairOrder, logout, getCurrentUser } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [repairOrders, setRepairOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const handleLogout = useCallback(() => {
    logout();
    setUser(null);
    setShowForm(false);
    setEditingOrder(null);
  }, []);

  const fetchRepairOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllRepairOrders();
      setRepairOrders(data);
    } catch (error) {
      console.error('Error fetching repair orders:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        // Token invalid, logout
        alert('Sesi Anda telah berakhir. Silakan login kembali.');
        handleLogout();
      } else {
        alert('Gagal mengambil data repair orders: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setLoading(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      fetchRepairOrders();
    } else {
      setLoading(false);
    }
  }, [fetchRepairOrders]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    fetchRepairOrders();
  };

  const handleCreate = async (orderData) => {
    try {
      await createRepairOrder(orderData);
      alert('Repair order berhasil ditambahkan!');
      setShowForm(false);
      fetchRepairOrders();
    } catch (error) {
      console.error('Error creating repair order:', error);
      alert(error.response?.data?.message || 'Gagal menambahkan repair order');
    }
  };

  const handleUpdate = async (orderData) => {
    try {
      await updateRepairOrder(editingOrder.id, orderData);
      alert('Repair order berhasil diupdate!');
      setShowForm(false);
      setEditingOrder(null);
      fetchRepairOrders();
    } catch (error) {
      console.error('Error updating repair order:', error);
      alert(error.response?.data?.message || 'Gagal mengupdate repair order');
    }
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus repair order ini?')) {
      try {
        await deleteRepairOrder(id);
        alert('Repair order berhasil dihapus!');
        fetchRepairOrders();
      } catch (error) {
        console.error('Error deleting repair order:', error);
        alert(error.response?.data?.message || 'Gagal menghapus repair order');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingOrder(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>REPAIR ORDER SYSTEM</h1>
            <p>Sistem Manajemen Perbaikan Perangkat</p>
          </div>
          <div className="header-user-info">
            <span>Welcome, <strong>{user.username}</strong> ({user.role})</span>
            <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="action-bar">
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            + Tambah Repair Order Baru
          </button>
        </div>

        {showForm && (
          <RepairOrderForm
            order={editingOrder}
            onSubmit={editingOrder ? handleUpdate : handleCreate}
            onCancel={handleCancel}
          />
        )}

        {loading ? (
          <div className="loading">Memuat data...</div>
        ) : (
          <RepairOrderTable
            orders={repairOrders}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}

export default App;
