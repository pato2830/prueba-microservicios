import { useEffect, useState } from 'react';
import { X, User, Mail, Lock } from 'lucide-react';

export default function UserModal({ isOpen, onClose, onSubmit, editingUser }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingUser) {
      setForm({
        name: editingUser.name || '',
        email: editingUser.email || '',
        password: '',
      });
    } else {
      setForm({
        name: '',
        email: '',
        password: '',
      });
    }
  }, [editingUser, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await onSubmit(form);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {editingUser ? 'Editar usuario' : 'Nuevo usuario'}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Completa la información del usuario.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Nombre completo
            </label>

            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={19} />

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nombre del usuario"
                required
                className="w-full rounded-lg border border-slate-300 py-3 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Correo electrónico
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={19} />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                required
                className="w-full rounded-lg border border-slate-300 py-3 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Contraseña
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={19} />

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder={editingUser ? 'Dejar vacío para conservarla' : 'Contraseña'}
                required={!editingUser}
                minLength={editingUser && !form.password ? undefined : 6}
                className="w-full rounded-lg border border-slate-300 py-3 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {editingUser && (
              <p className="mt-2 text-xs text-slate-400">
                Si no deseas cambiar la contraseña, deja este campo vacío.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? 'Guardando...' : editingUser ? 'Guardar cambios' : 'Crear usuario'}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}