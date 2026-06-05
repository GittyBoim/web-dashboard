import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { itemsAPI, companyAPI } from '../services/api';

const CompanyDashboard = () => {
  const { user, logout } = useAuth();
  const [company, setCompany] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [bulkCount, setBulkCount] = useState(1);
  const [bulkName, setBulkName] = useState('');
  const [bulkDescription, setBulkDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Verify that user is a COMPANY role
      if (user.role !== 'COMPANY') {
        setError('Access denied: This dashboard is for company users only');
        setLoading(false);
        return;
      }

      // Verify that user has a companyId
      if (!user.companyId) {
        setError('Error: User is not assigned to a company');
        setLoading(false);
        return;
      }

      // Load company data
      const companyRes = await companyAPI.getCompanyById(user.companyId);
      setCompany(companyRes.data);

      // Load items for this company
      try {
        const itemsRes = await itemsAPI.getCompanyItems(user.companyId);
        // API returns array directly
        const itemsData = Array.isArray(itemsRes.data) ? itemsRes.data : itemsRes.data.items || [];
        setItems(itemsData);
      } catch (err) {
        console.error('Failed to load company items:', err);
        setItems([]);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      setError(error.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user.companyId) {
      setError('Error: User company ID not found');
      return;
    }

    try {
      const result = await itemsAPI.createItem({
        ...formData,
        companyId: user.companyId,
      });
      setSuccess(`Item created successfully! Serial: ${result.data.item.serialNumber}`);
      setFormData({ name: '', description: '' });
      setShowCreateForm(false);
      loadData();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create item');
    }
  };

  const handleBulkCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user.companyId) {
      setError('Error: User company ID not found');
      return;
    }

    try {
      const result = await itemsAPI.createBulkItems({
        companyId: user.companyId,
        count: bulkCount,
        name: bulkName,
        description: bulkDescription,
      });
      setSuccess(`${bulkCount} items created successfully!`);
      setBulkCount(1);
      setBulkName('');
      setBulkDescription('');
      setShowBulkForm(false);
      loadData();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create items');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Company Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="dashboard-content">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {company && (
          <div className="company-info">
            <div className="company-header">
              <div className="company-header-content">
                <h2>{company.name}</h2>
                <span className="company-type-badge">{company.type}</span>
              </div>
            </div>
            <div className="company-details">
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{company.email || 'Not provided'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone</span>
                  <span className="detail-value">{company.phone || 'Not provided'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Address</span>
                  <span className="detail-value">{company.address || 'Not provided'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Team Members</span>
                  <span className="detail-value detail-count">{company.users?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="actions">
          <button onClick={() => setShowCreateForm(true)} className="btn-primary">
            Create Single Item
          </button>
          <button onClick={() => setShowBulkForm(true)} className="btn-secondary">
            Create Bulk Items
          </button>
        </div>

        {showCreateForm && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Create New Item</h2>
                <button 
                  className="modal-close" 
                  onClick={() => setShowCreateForm(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-content">
                <form onSubmit={handleCreateItem}>
                  <div className="form-group">
                    <label htmlFor="name">Item Name (Optional)</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Laptop, Printer, Key..."
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description (Optional)</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter item description..."
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit">Create Item</button>
                    <button type="button" onClick={() => setShowCreateForm(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {showBulkForm && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Create Bulk Items</h2>
                <button 
                  className="modal-close" 
                  onClick={() => setShowBulkForm(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-content">
                <form onSubmit={handleBulkCreate}>
                  <div className="form-group">
                    <label htmlFor="bulk-name">Item Name (Optional)</label>
                    <input
                      type="text"
                      id="bulk-name"
                      value={bulkName}
                      onChange={(e) => setBulkName(e.target.value)}
                      placeholder="e.g., Laptop, Printer, Key..."
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="bulk-description">Description (Optional)</label>
                    <textarea
                      id="bulk-description"
                      value={bulkDescription}
                      onChange={(e) => setBulkDescription(e.target.value)}
                      placeholder="Enter item description..."
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="count">Number of Items</label>
                    <input
                      type="number"
                      id="count"
                      min="1"
                      max="100"
                      value={bulkCount}
                      onChange={(e) => setBulkCount(parseInt(e.target.value))}
                      required
                    />
                    <p className="help-text">Maximum 100 items per batch</p>
                  </div>

                  <div className="form-actions">
                    <button type="submit">Create {bulkCount} Items</button>
                    <button type="button" onClick={() => setShowBulkForm(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="items-section">
          <h2>Your Items</h2>
          {items.length === 0 ? (
            <p className="empty-state">No items created yet. Create your first QR code item!</p>
          ) : (
            <div className="items-grid">
              {items.map((item) => (
                <div key={item.id} className="item-card">
                  <h3>{item.name || 'Unnamed Item'}</h3>
                  <p><strong>Serial:</strong> {item.serialNumber}</p>
                  <p><strong>Status:</strong> {item.status}</p>
                  <p><strong>Created:</strong> {new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CompanyDashboard;