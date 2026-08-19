import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatabaseService } from '../../services/database.service';
import { User } from '../../types';
import politekLogo from '../../assets/politek_logo.jpg';
import { LogIn, ShieldCheck, UserCheck, Lock, Mail, Sparkles, ArrowRight } from 'lucide-react';

interface AuthPageProps {
  onLoginSuccess?: (user: User) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        const newUser: User = {
          id: `usr_${Date.now()}`,
          name: name || 'Siswa Politek IBC',
          email,
          role: 'student',
          registeredDate: new Date().toISOString()
        };
        DatabaseService.setStoredUser(newUser);
        if (onLoginSuccess) onLoginSuccess(newUser);
        navigate('/student');
      } else {
        const user = await DatabaseService.authenticateUser(email, password, role);
        if (user) {
          DatabaseService.setStoredUser(user);
          if (onLoginSuccess) onLoginSuccess(user as any);
          if (user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/student');
          }
        } else {
          setError('Email atau kata sandi tidak sesuai.');
        }
      }
    } catch (err) {
      setError('Terjadi kesalahan saat masuk. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 bg-slate-900 min-h-[85vh] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 relative z-10">
        
        {/* Role Switcher Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50">
          <button
            type="button"
            onClick={() => { setRole('student'); setError(''); }}
            className={`flex-1 py-4 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              role === 'student'
                ? 'bg-white text-indigo-600 border-b-2 border-indigo-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Portal Siswa</span>
          </button>
          
          <button
            type="button"
            onClick={() => { setRole('admin'); setError(''); setIsRegister(false); }}
            className={`flex-1 py-4 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              role === 'admin'
                ? 'bg-white text-indigo-600 border-b-2 border-indigo-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Portal Admin</span>
          </button>
        </div>

        {/* Header Content */}
        <div className="p-8 pb-4 text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white p-1 shadow-sm border border-slate-200 flex items-center justify-center overflow-hidden">
            <img 
              src={politekLogo} 
              alt="Logo Politek IBC" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {isRegister ? 'Pendaftaran Akun Siswa' : `Masuk ${role === 'admin' ? 'Administrator' : 'Siswa'}`}
          </h2>
          <p className="text-xs text-slate-500">
            {role === 'admin' 
              ? 'Akses panel manajemen sistem Politek IBC' 
              : 'Akses dashboard belajar, modul, dan histori placement test'}
          </p>
        </div>

        {/* Demo Credentials Box for Admin */}
        {role === 'admin' && (
          <div className="mx-8 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-0.5">
            <p className="font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Kredensial Akses Demo Admin:
            </p>
            <p className="text-[11px] text-amber-800">Email: <span className="font-mono bg-amber-100 px-1 rounded">admin@politek-ibc.ac.id</span></p>
            <p className="text-[11px] text-amber-800">Password: <span className="font-mono bg-amber-100 px-1 rounded">admin123</span></p>
          </div>
        )}

        {error && (
          <div className="mx-8 mt-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 text-center font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                required
                placeholder="Rian Febrian"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              Alamat Email
            </label>
            <input
              type="email"
              required
              placeholder={role === 'admin' ? 'admin@politek-ibc.ac.id' : 'siswa@gmail.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              Kata Sandi
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>{loading ? 'Memproses...' : isRegister ? 'Daftar Sekarang' : 'Masuk Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {role === 'student' && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-xs text-indigo-600 font-semibold hover:underline cursor-pointer"
              >
                {isRegister ? 'Sudah punya akun? Masuk di sini' : 'Belum punya akun? Buat Akun Baru'}
              </button>
            </div>
          )}
        </form>

      </div>
    </div>
  );
};
