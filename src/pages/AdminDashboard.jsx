import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { companyAPI, adminAPI } from '../services/api';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ companies: 0, users: 0, items: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('companies');
  
  // Company creation modal
  const [showCreateCompanyModal, setShowCreateCompanyModal] = useState(false);
  const [companyFormData, setCompanyFormData] = useState({
    name: '',
    type: 'BUSINESS',
    email: '',
    phone: '',
    address: '',
  });

  // Company user creation modal
  const [showCreateCompanyUserModal, setShowCreateCompanyUserModal] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [companyUserFormData, setCompanyUserFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [companiesRes, usersRes] = await Promise.all([
        companyAPI.getAllCompanies(),
        adminAPI.getUsers(),
      ]);

      setCompanies(companiesRes.data || []);
      setUsers(usersRes.data || []);
      setStats({
        companies: companiesRes.data?.length || 0,
        users: usersRes.data?.length || 0,
        items: 0,
      });
    } catch (error) {
      console.error('Failed to load data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await companyAPI.createCompany(companyFormData);
      setSuccess('Company created successfully!');
      setCompanyFormData({
        name: '',
        type: 'BUSINESS',
        email: '',
        phone: '',
        address: '',
      });
      setShowCreateCompanyModal(false);
      loadData();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create company');
    }
  };

  const handleCreateCompanyUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedCompanyId) {
      setError('Please select a company');
      return;
    }

    try {
      await companyAPI.createCompanyUser(selectedCompanyId, companyUserFormData);
      setSuccess('Company user created successfully!');
      setCompanyUserFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
      });
      setSelectedCompanyId('');
      setShowCreateCompanyUserModal(false);
      loadData();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create company user');
    }
  };

  const renderCompanies = () => (
    <div className="data-section">
      <div className="section-header">
        <h2>Companies ({companies.length})</h2>
        <button 
          onClick={() => setShowCreateCompanyModal(true)} 
          className="btn-primary"
        >
          + Create Company
        </button>
      </div>
      <div className="data-grid">
        {companies.map((company) => (
          <div key={company.id} className="data-card">
            <h3>{company.name}</h3>
            <p>Type: {company.type}</p>
            <p>Email: {company.email || 'N/A'}</p>
            <p>Phone: {company.phone || 'N/A'}</p>
            <p>Users: {company.users?.length || 0}</p>
            <p>Created: {new Date(company.createdAt).toLocaleDateString()}</p>
            <button
              onClick={() => {
                setSelectedCompanyId(company.id);
                setShowCreateCompanyUserModal(true);
              }}
              className="btn-secondary btn-small"
            >
              Add User to Company
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="data-section">
      <h2>Users ({users.length})</h2>
      <div className="data-grid">
        {users.map((user) => (
          <div key={user.id} className="data-card">
            <h3>{user.name}</h3>
            <p>Email: {user.email}</p>
            <p>Role: <span className={`role-badge role-${user.role}`}>{user.role}</span></p>
            <p>Phone: {user.phone || 'N/A'}</p>
            {user.companyId && <p>Company ID: {user.companyId}</p>}
            <p>Created: {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStats = () => (
    <div className="stats-section">
      <h2>Statistics</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.companies}</h3>
          <p>Total Companies</p>
        </div>
        <div className="stat-card">
          <h3>{stats.users}</h3>
          <p>Total Users</p>
        </div>
        <div className="stat-card">
          <h3>{stats.items}</h3>
          <p>Total Items</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="tabs">
          <button
            className={activeTab === 'stats' ? 'active' : ''}
            onClick={() => setActiveTab('stats')}
          >
            Statistics
          </button>
          <button
            className={activeTab === 'companies' ? 'active' : ''}
            onClick={() => setActiveTab('companies')}
          >
            Companies
          </button>
          <button
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {loading ? (
          <div className="loading">Loading data...</div>
        ) : (
          <>
            {activeTab === 'stats' && renderStats()}
            {activeTab === 'companies' && renderCompanies()}
            {activeTab === 'users' && renderUsers()}
          </>
        )}
      </main>

      {/* Create Company Modal */}
      {showCreateCompanyModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Create New Company</h2>
              <button 
                className="modal-close" 
                onClick={() => setShowCreateCompanyModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateCompany}>
              <div className="form-group">
                <label htmlFor="name">Company Name *</label>
                <input
                  type="text"
                  id="name"
                  value={companyFormData.name}
                  onChange={(e) => setCompanyFormData({ ...companyFormData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Company Type</label>
                <select
                  id="type"
                  value={companyFormData.type}
                  onChange={(e) => setCompanyFormData({ ...companyFormData, type: e.target.value })}
                >
                  <option value="BUSINESS">Business</option>
                  <option value="NON_PROFIT">Non-Profit</option>
                  <option value="GOVERNMENT">Government</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={companyFormData.email}
                  onChange={(e) => setCompanyFormData({ ...companyFormData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  value={companyFormData.phone}
                  onChange={(e) => setCompanyFormData({ ...companyFormData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  value={companyFormData.address}
                  onChange={(e) => setCompanyFormData({ ...companyFormData, address: e.target.value })}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">Create Company</button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowCreateCompanyModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Company User Modal */}
      {showCreateCompanyUserModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Create Company User</h2>
              <button 
                className="modal-close" 
                onClick={() => setShowCreateCompanyUserModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateCompanyUser}>
              <div className="form-group">
                <label htmlFor="company">Company *</label>
                <select
                  id="company"
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  required
                >
                  <option value="">Select a company</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="user-name">Name *</label>
                <input
                  type="text"
                  id="user-name"
                  value={companyUserFormData.name}
                  onChange={(e) => setCompanyUserFormData({ ...companyUserFormData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="user-email">Email *</label>
                <input
                  type="email"
                  id="user-email"
                  value={companyUserFormData.email}
                  onChange={(e) => setCompanyUserFormData({ ...companyUserFormData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="user-password">Password *</label>
                <input
                  type="password"
                  id="user-password"
                  value={companyUserFormData.password}
                  onChange={(e) => setCompanyUserFormData({ ...companyUserFormData, password: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="user-phone">Phone</label>
                <input
                  type="tel"
                  id="user-phone"
                  value={companyUserFormData.phone}
                  onChange={(e) => setCompanyUserFormData({ ...companyUserFormData, phone: e.target.value })}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">Create User</button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowCreateCompanyUserModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;