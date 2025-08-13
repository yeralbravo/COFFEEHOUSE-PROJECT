import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import '../style/Dashboard.css';

const Dashboard = () => {
  const { user, logout, editUser, deleteOwnAccount } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ correo: '', nombre: '', contraseña: '', confirmarContraseña: '' });

  useEffect(() => {
    if (user) {
      setForm({
        correo: user.correo || '',
        nombre: user.nombre || '',
        contraseña: '',
        confirmarContraseña: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editUser(user.id, form);
      alert('Perfil actualizado correctamente');
      setShowModal(false);
    } catch (error) {
      alert(error.message || 'Error al actualizar el perfil');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('¿Estás seguro que quieres eliminar tu cuenta?');
    if (!confirmed) return;

    try {
      await deleteOwnAccount(user.id);
      alert('Cuenta eliminada correctamente');
    } catch (error) {
      alert(error.message || 'Error al eliminar la cuenta');
    }
  };

  return (
    <div>
      <div className="dashboard-container">
        <div className="user-card">
          <h2>{user.nombre}</h2>
          <p>{user.correo}</p>
          <button onClick={() => setShowModal(true)}>Editar Perfil</button>
          <button onClick={handleDeleteAccount} className="delete-account-btn">Eliminar Cuenta</button>
        </div>
        <button onClick={logout}>Cerrar Sesión</button>
      </div>

      {showModal && (
        <div
          className="form-modal-overlay"
          onClick={(e) => {
            if (e.target.classList.contains('form-modal-overlay')) {
              setShowModal(false);
            }
          }}
        >
          <div className="form-modal">
            <h2>Editar Usuario</h2>
            <form className="modal-form" onSubmit={handleSubmit}>
              <label htmlFor="correo">Correo electrónico</label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={form.correo}
                onChange={handleChange}
                required
              />

              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />

              <label htmlFor="contraseña">Contraseña</label>
              <input
                type="password"
                id="contraseña"
                name="contraseña"
                value={form.contraseña}
                onChange={handleChange}
              />

              <label htmlFor="confirmarContraseña">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmarContraseña"
                name="confirmarContraseña"
                value={form.confirmarContraseña}
                onChange={handleChange}
              />

              <button type="submit">Guardar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;