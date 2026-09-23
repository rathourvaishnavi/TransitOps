import React from 'react'
import { useForm } from 'react-hook-form'
import api from '../api/axios'
import socket, { connect } from '../api/socket'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function Login(){
  const { register, handleSubmit } = useForm();
  const nav = useNavigate();
  const { setUser } = useContext(AuthContext);
  const onSubmit = async (data) => {
    const payload = { email: (data.email || '').trim(), password: (data.password || '').trim() };
    if (!payload.email || !payload.password) { alert('Email and password are required'); return; }
    try {
      const res = await api.post('/auth/login', payload);
      localStorage.setItem('token', res.data.token);
      if (res.data.refreshToken) localStorage.setItem('refreshToken', res.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      // connect socket (auth sent via handshake)
      try { connect(); } catch (e) { console.warn('socket connect failed', e); }
      nav('/dashboard');
    } catch (err) { alert(err.response?.data?.error || 'Login failed'); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_35%),linear-gradient(180deg,_#0f172a_0%,_#020617_100%)] p-6">
      <div className="w-full max-w-md p-8 rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl shadow-cyan-950/30 text-white">
        <div className="mb-6">
          <div className="text-xs uppercase tracking-[0.28em] text-cyan-300">TransitOps</div>
          <h2 className="text-3xl font-semibold mt-2">Sign in</h2>
          <p className="text-sm text-slate-300 mt-2">Access fleet, trips, maintenance, and analytics.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input {...register('email')} className="w-full p-3 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-cyan-400" placeholder="Email" />
          <input {...register('password')} className="w-full p-3 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-cyan-400" placeholder="Password" type="password" />
          <button type="submit" className="w-full py-3 rounded-xl bg-cyan-400 text-slate-950 font-semibold hover:bg-cyan-300 transition">Login</button>
        </form>
        <div className="mt-5 text-xs text-slate-400">
          Demo: admin@transitops.com / password
        </div>
      </div>
    </div>
  )
}
