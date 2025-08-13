import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import '../style/UserList.css';

const UserList = ({ users, onEdit, onDelete }) => {
    const { user: adminUser } = useContext(AuthContext);

    return (
        <div className="list-container">
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Nombre Completo</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.nombre} {user.apellido}</td>
                            <td>{user.correo}</td>
                            <td>{user.telefono}</td>
                            <td><span className={`role-badge role-${user.role}`}>{user.role}</span></td>
                            <td>
                                <div className="action-buttons">
                                    <button onClick={() => onEdit(user)} className="action-btn edit-btn">
                                        <FiEdit />
                                    </button>
                                    {/* Un admin no puede eliminarse a sí mismo */}
                                    {adminUser.id !== user.id && (
                                        <button onClick={() => onDelete(user.id)} className="action-btn delete-btn">
                                            <FiTrash2 />
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;