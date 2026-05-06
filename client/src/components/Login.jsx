import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, ArrowRight, Gamepad2, ShieldCheck } from 'lucide-react';

const Login = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = isLogin ? '/auth/login' : '/auth/register';
        
        try {
            const response = await fetch(`http://${window.location.hostname}:3002${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            if (isLogin) {
                localStorage.setItem('uno_user', JSON.stringify(data));
                onLogin(data);
            } else {
                setIsLogin(true);
                setUsername('');
                setPassword('');
                setError('Registration successful! Please login.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const s = {
        overlay: {
            position: 'fixed', inset: 0,
            background: 'radial-gradient(circle at center, #450a0a 0%, #1a0000 70%, #000 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Nunito', sans-serif", overflow: 'hidden'
        },
        card: {
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '40px',
            padding: '60px',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
            textAlign: 'center',
            position: 'relative',
            zIndex: 10
        },
        inputGroup: {
            position: 'relative',
            marginBottom: '20px'
        },
        input: {
            width: '100%',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '16px 20px 16px 50px',
            color: 'white',
            fontSize: '16px',
            outline: 'none',
            transition: 'all 0.3s'
        },
        icon: {
            position: 'absolute',
            left: '18px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#94a3b8'
        }
    };

    return (
        <div style={s.overlay}>
            {/* Background elements */}
            <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 70%)', filter: 'blur(80px)' }} />
            <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', filter: 'blur(80px)' }} />

            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} style={s.card}>
                <div style={{ marginBottom: '40px' }}>
                    <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #ef4444, #b91c1c)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 20px 40px rgba(239,68,68,0.3)' }}>
                        <Gamepad2 size={40} color="white" />
                    </div>
                    <h1 style={{ fontSize: '32px', fontWeight: 900, color: 'white', letterSpacing: '2px' }}>UNO ONLINE</h1>
                    <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '8px', fontWeight: 600 }}>{isLogin ? 'WELCOME BACK, PLAYER!' : 'CREATE YOUR LEGENDARY ACCOUNT'}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={s.inputGroup}>
                        <User size={20} style={s.icon} />
                        <input 
                            type="text" 
                            placeholder="Username" 
                            style={s.input}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div style={s.inputGroup}>
                        <Lock size={20} style={s.icon} />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            style={s.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ color: '#f87171', fontSize: '13px', marginBottom: '20px', fontWeight: 700 }}>
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button className="btn-start" style={{ width: '100%', marginBottom: '24px', opacity: loading ? 0.7 : 1 }} disabled={loading}>
                        {loading ? 'PROCESSING...' : (isLogin ? 'LOGIN TO PLAY' : 'CREATE ACCOUNT')}
                        <ArrowRight size={20} style={{ marginLeft: '10px' }} />
                    </button>
                </form>

                <div style={{ color: '#64748b', fontSize: '14px', fontWeight: 600 }}>
                    {isLogin ? "DON'T HAVE AN ACCOUNT?" : "ALREADY HAVE AN ACCOUNT?"}{' '}
                    <span onClick={() => setIsLogin(!isLogin)} style={{ color: '#ef4444', cursor: 'pointer', fontWeight: 800, textDecoration: 'underline' }}>
                        {isLogin ? 'SIGN UP' : 'LOG IN'}
                    </span>
                </div>

                <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#334155' }}>
                    <ShieldCheck size={16} />
                    <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1px' }}>SECURE AUTHENTICATION ACTIVE</span>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
