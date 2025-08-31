// src/components/TimeRangeFilter.jsx

import React from 'react';
import '../style/TimeRangeFilter.css'; // Asegúrate de que la ruta sea correcta

const timeRangeOptions = {
    day: 'Hoy',
    week: 'Esta Semana',
    month: 'Este Mes',
    year: 'Este Año'
};

/**
 * Componente para filtros de tiempo, incluyendo rangos predefinidos y un selector de fecha.
 * @param {object} props
 * @param {string} props.currentRange - El rango de tiempo actual ('day', 'week', etc.).
 * @param {function} props.onRangeChange - Callback para cuando cambia el rango.
 * @param {string} props.selectedDate - La fecha seleccionada (ej: '2025-08-31').
 * @param {function} props.onDateChange - Callback para cuando cambia la fecha.
 */
const TimeRangeFilter = ({ currentRange, onRangeChange, selectedDate, onDateChange }) => {

    // Manejador para cuando el usuario selecciona una fecha
    const handleDateChange = (event) => {
        const newDate = event.target.value;
        onDateChange(newDate);  // Actualiza la fecha en el estado del componente padre
        onRangeChange('');      // Limpia el filtro de rango (Hoy, Semana, etc.)
    };

    // Manejador para cuando el usuario hace clic en un botón de rango
    const handleRangeClick = (key) => {
        onRangeChange(key);     // Actualiza el rango en el estado del componente padre
        onDateChange('');       // Limpia la fecha seleccionada
    };

    return (
        <div className="time-filters-container">
            {/* Botones de rango de tiempo */}
            <div className="time-range-buttons">
                {Object.entries(timeRangeOptions).map(([key, label]) => (
                    <button
                        key={key}
                        onClick={() => handleRangeClick(key)}
                        className={currentRange === key ? 'active' : ''}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Input para búsqueda por fecha específica */}
            <div className="date-input-wrapper">
                <input
                    type="date" // Usamos el tipo 'date' para un selector nativo
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="date-filter-input"
                />
            </div>
        </div>
    );
};

export default TimeRangeFilter;