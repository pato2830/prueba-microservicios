import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockKeyhole, Mail, Eye, EyeOff, LogIn } from 'lucide-react';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Ingresa tu correo electrónico y contraseña.',
      });
      return;
    }

    try {
      setLoading(true);

      await login(email.trim(), password);

      await Swal.fire({
        icon: 'success',
        title: 'Bienvenido',
        text: 'Inicio de sesión exitoso.',
        timer: 1200,
        showConfirmButton: false,
      });

      navigate('/dashboard');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Acceso denegado',
        text:
          error.response?.data?.message ||
          error.message ||
          'No se pudo conectar con el servidor.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        
        <div className="bg-slate-900 px-8 py-10 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <LockKeyhole size={30} />
          </div>

          <h1 className="text-2xl font-bold text-white">
            Panel Administrativo
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Sistema de gestión de usuarios
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-8 py-8">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Iniciar sesión
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Ingresa tus credenciales para continuar.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Correo electrónico
            </label>

            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={19}
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@prueba.com"
                autoComplete="username"
                className="w-full rounded-lg border border-slate-300 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Contraseña
            </label>

            <div className="relative">
              <LockKeyhole
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={19}
              />

              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
                className="w-full rounded-lg border border-slate-300 py-3 pl-11 pr-12 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              'Verificando...'
            ) : (
              <>
                <LogIn size={19} />
                Ingresar al sistema
              </>
            )}
          </button>

          <p className="text-center text-xs text-slate-400">
            Sistema de gestión · Arquitectura de microservicios
          </p>
        </form>
      </div>
    </main>
  );
}