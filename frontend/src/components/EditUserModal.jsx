import React, { useState, useEffect } from 'react';
import '../style/Modal.css';

const EditUserModal = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({ ...user });

    useEffect(() => {
        setFormData({ ...user });
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!user) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Editar Usuario</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre</label>
                        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Apellido</label>
                        <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Teléfono</label>
                        <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} />
                    </div>
                     <div className="form-group">
                        <label>Rol</label>
                        <select name="role" value={formData.role} onChange={handleChange}>
                            <option value="client">Cliente</option>
                            <option value="supplier">Proveedor</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
                        <button type="submit" className="btn-save">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;