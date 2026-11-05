import { useEffect, useMemo, useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Pencil,
  Trash2,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Mail,
  CalendarDays,
} from 'lucide-react';

import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import UserModal from '../components/UserModal';

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../services/userService';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Obtener usuarios desde Users Service
  const loadUsers = async () => {
    try {
      setLoading(true);

      const response = await getUsers();

      setUsers(response.data || []);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);

      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text:
          error.response?.data?.message ||
          'No fue posible obtener los usuarios.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filtrar usuarios
  const filteredUsers = useMemo(() => {
    const value = search.toLowerCase().trim();

    return users.filter(
      (item) =>
        item.name.toLowerCase().includes(value) ||
        item.email.toLowerCase().includes(value)
    );
  }, [users, search]);

  // Abrir modal de creación
  const handleCreate = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  // Abrir modal de edición
  const handleEdit = (selectedUser) => {
    setEditingUser(selectedUser);
    setModalOpen(true);
  };

  // Crear o actualizar usuario
  const handleSave = async (formData) => {
    try {
      if (editingUser) {
        const data = {
          name: formData.name,
          email: formData.email,
        };

        if (formData.password.trim()) {
          data.password = formData.password;
        }

        await updateUser(editingUser.id, data);

        await Swal.fire({
          icon: 'success',
          title: 'Usuario actualizado',
          text: 'Los cambios se guardaron correctamente.',
          timer: 1800,
          showConfirmButton: false,
        });
      } else {
        await createUser(formData);

        await Swal.fire({
          icon: 'success',
          title: 'Usuario creado',
          text: 'El usuario se registró correctamente.',
          timer: 1800,
          showConfirmButton: false,
        });
      }

      await loadUsers();
    } catch (error) {
      console.error('Error al guardar usuario:', error);

      Swal.fire({
        icon: 'error',
        title: 'No se pudo guardar',
        text:
          error.response?.data?.message ||
          'Ocurrió un error al guardar el usuario.',
      });

      throw error;
    }
  };

  // Eliminar usuario
  const handleDelete = async (selectedUser) => {
    const result = await Swal.fire({
      title: '¿Eliminar usuario?',
      text: `Se eliminará a ${selectedUser.name}. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    try {
      await deleteUser(selectedUser.id);

      await Swal.fire({
        icon: 'success',
        title: 'Usuario eliminado',
        text: 'El registro se eliminó correctamente.',
        timer: 1800,
        showConfirmButton: false,
      });

      await loadUsers();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);

      Swal.fire({
        icon: 'error',
        title: 'Error al eliminar',
        text:
          error.response?.data?.message ||
          'No fue posible eliminar el usuario.',
      });
    }
  };

  // Cerrar sesión
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas salir del sistema?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Cerrar sesión',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2563eb',
    });

    if (result.isConfirmed) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Encabezado */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-600 p-2 text-white">
                <ShieldCheck size={25} />
              </div>

              <div>
                <h1 className="text-xl font-bold text-slate-800">
                  Panel Administrativo
                </h1>

                <p className="text-sm text-slate-500">
                  Sistema de gestión de usuarios
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">
                {user?.name}
              </p>

              <p className="text-xs text-slate-500">
                {user?.email}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              <LogOut size={18} />
              Cerrar sesión
            </button>
          </div>

        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Indicadores */}
        <section className="mb-8 grid gap-5 sm:grid-cols-2">

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Usuarios registrados
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-800">
                  {users.length}
                </h2>
              </div>

              <div className="rounded-xl bg-blue-50 p-4 text-blue-600">
                <Users size={28} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Sesión actual
                </p>

                <h2 className="mt-2 text-lg font-bold text-slate-800">
                  {user?.name}
                </h2>
              </div>

              <div className="rounded-xl bg-emerald-50 p-4 text-emerald-600">
                <ShieldCheck size={28} />
              </div>
            </div>
          </div>

        </section>

        {/* Gestión de usuarios */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col gap-4 border-b border-slate-200 p-6 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Gestión de usuarios
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Administra los usuarios registrados en el sistema.
              </p>
            </div>

            <button
              onClick={handleCreate}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <UserPlus size={19} />
              Nuevo usuario
            </button>

          </div>

          {/* Búsqueda y actualización */}
          <div className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">

            <div className="relative w-full sm:max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={19}
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre o correo..."
                className="w-full rounded-lg border border-slate-300 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              onClick={loadUsers}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
              Actualizar
            </button>

          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">

            <table className="w-full text-left text-sm">

              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">Usuario</th>
                  <th className="px-6 py-4">Correo electrónico</th>
                  <th className="px-6 py-4">Fecha de registro</th>
                  <th className="px-6 py-4 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {loading ? (

                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                      Cargando usuarios...
                    </td>
                  </tr>

                ) : filteredUsers.length === 0 ? (

                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                      No se encontraron usuarios.
                    </td>
                  </tr>

                ) : (

                  filteredUsers.map((item) => (

                    <tr key={item.id} className="transition hover:bg-slate-50">

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                            {item.name.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {item.name}
                            </p>

                            <p className="text-xs text-slate-400">
                              ID: {item.id}
                            </p>
                          </div>

                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-slate-400" />
                          {item.email}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-500">
                        <div className="flex items-center gap-2">
                          <CalendarDays size={16} />
                          {new Date(item.createdAt).toLocaleDateString('es-EC')}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">

                          <button
                            onClick={() => handleEdit(item)}
                            title="Editar usuario"
                            className="rounded-lg bg-blue-50 p-2.5 text-blue-600 hover:bg-blue-100"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            onClick={() => handleDelete(item)}
                            title="Eliminar usuario"
                            className="rounded-lg bg-red-50 p-2.5 text-red-600 hover:bg-red-100"
                          >
                            <Trash2 size={17} />
                          </button>

                        </div>
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

          <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
            <p className="text-sm text-slate-500">
              Mostrando <strong>{filteredUsers.length}</strong> de{' '}
              <strong>{users.length}</strong> usuarios.
            </p>
          </div>

        </section>

      </main>

      {/* Modal de creación y edición */}
      <UserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
        editingUser={editingUser}
      />

    </div>
  );
}