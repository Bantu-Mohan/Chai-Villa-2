import React, { useState } from 'react';
import './AdminLogin.css';

function AdminLogin({ onLogin }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Check against Environment Variable
        const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
        
        if (password === correctPassword) {
            onLogin();
        } else {
            setError('Invalid Password');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 style={{color: 'var(--primary)', marginBottom:'1rem'}}>Admin Access</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="password" 
                        placeholder="Enter Admin Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                        autoFocus
                    />
                    {error && <div className="login-error">{error}</div>}
                    <button type="submit" className="login-btn">Login</button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;
