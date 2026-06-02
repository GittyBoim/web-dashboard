import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      if (user.role === 'COMPANY') {
        navigate('/company');
      } else if (user.role === 'SUPER_ADMIN') {
        navigate('/admin');
      } else {
        setError('Logged in, but your role is not authorized for a dashboard.');
      }
    }
  }, [user, navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const result = await login(credentials);

    if (result.success) {
      setSuccess('Login successful! Redirecting...');
      if (result.user?.role === 'COMPANY') {
        navigate('/company');
      } else if (result.user?.role === 'SUPER_ADMIN') {
        navigate('/admin');
      }
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleLoginChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Lost Items Dashboard</h1>

        <form onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleLoginChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleLoginChange}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="info-text">
            <strong>SUPER_ADMIN:</strong> Use your admin account to manage companies and create company users.<br />
            <strong>COMPANY USERS:</strong> Contact your SUPER_ADMIN to be registered.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;